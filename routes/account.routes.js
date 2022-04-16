const express = require( 'express' );
const router = express.Router();
const account_model = require( '../models/account.model' );
const account_auth = require( '../middlewares/account_auth.mdw' );
const moment = require( 'moment' );
const email_otp = require( '../utils/email_otp' );
const email_activate = require( '../utils/email_activate' );
const dt_util = require( '../utils/datetime' );
const pagination = require( '../utils/pagination' );
const bcrypt = require( 'bcryptjs' );
const passport = require( '../config/passport.config' );

router.get( '/is-available', async ( req, res ) =>
{
    const username = req.query.username;
    const email = req.query.email;
    const [ user_by_username, user_by_email ] = await Promise.all( [
        account_model.find_by_username( username ),
        account_model.find_by_email( email )
    ] );
    if ( user_by_username || user_by_email )
        return res.json( false );
    return res.json( true );
} );

router.post( '/signup', async ( req, res ) =>
{
    try
    {
        const hash = bcrypt.hashSync( req.body.signup_password, 10 );
        const dob = moment( req.body.signup_dob, 'DD/MM/YYYY' ).format( 'YYYY-MM-DD' );
        const user = {
            u_Username: req.body.signup_username,
            u_Password: hash,
            u_Email: req.body.signup_email,
            u_Name: req.body.signup_name,
            u_DOB: dob,
            u_IsActivated: false,
            u_IsPublisher: false,
            u_IsAdmin: false,
            u_IsBanned: false
        };
        email_activate( user );
        res.redirect( '/' );
    }
    catch ( error ) { console.log( error ); }
} );

router.get( '/activate', async function ( req, res )
{
    const secret = req.query.key;
    const user = {
        u_Username: req.query.u_Username,
        u_Password: req.query.u_Password,
        u_DOB: req.query.u_DOB,
        u_Name: req.query.u_Name,
        u_Email: req.query.u_Email,
        u_IsActivated: false,
        u_IsBanned: false,
        u_IsAdmin: false,
        u_IsPublisher: false
    };
    const is_similar = await bcrypt.compareSync( user.u_Username, secret );
    if ( is_similar )
    {
        user.u_IsActivated = true;
        await account_model.add( user );
        return res.json( true );
    }
    res.json( false );
} );

router.post( '/login', async ( req, res, next ) =>
{
    console.log( 'login..' );
    passport.authenticate( 'user', ( error, user, info ) =>
    {
        if ( error ) return res.json( { message: 'Invalid username or password!' } );
        if ( !user ) return res.json( { message: info.message } );
        req.login( user, err =>
        {
            if ( err ) return res.json( { message: 'Invalid username or password!' } );

            if ( user.u_IsPublisher ) req.session.role = 'publisher';
            else if ( user.u_IsAdmin ) req.session.role = 'admin';
            else req.session.role = 'reader';

            res.redirect( req.headers.referer );
        } );
    } )( req, res, next );
} );

router.post( '/logout', account_auth, ( req, res ) =>
{
    req.logout();
    req.is_auth = false;
    req.auth_user = null;
    res.redirect( req.headers.referer );
} );

router.get( '/profile', account_auth,
    async ( req, res ) =>
    {
        console.log( 'profile' );
        res.render( 'vwAccount/profile', { role: req.session.role } );
    } );

router.post( '/profile', account_auth, async ( req, res ) =>
{
    console.log( 'edit profile' );
    const user = {
        u_Name: req.body.name,
        u_DOB: moment( req.body.dob, 'DD/MM/YYYY' ).format( 'YYYY-MM-DD' ),
        u_ID: req.user.u_ID
    };
    await account_model.update_profile( user );
    res.redirect( req.headers.referer );
} );

router.get( '/change-password', account_auth,
    async ( req, res ) => res.render( 'vwAccount/change-password' ) );

router.get( '/is-correct-password', account_auth, async ( req, res ) =>
{
    const user_id = req.user.u_ID,
        password = req.query.password;
    const current_password = await account_model.get_password( user_id );
    if ( await bcrypt.compareSync( password, current_password ) )
        return res.json( true );
    return res.json( false );
} );

router.post( '/change-password', account_auth, async ( req, res ) =>
{
    const hash = await bcrypt.hashSync( req.body.new_password, 10 );
    const password_entity = {
        u_ID: req.user.u_ID,
        u_Password: hash
    };
    await account_model.update_password( password_entity );
    res.redirect( req.headers.referer );
} );

router.post( '/forget-password', async ( req, res ) =>
{
    const email = req.body.fp_email;
    const otp = Math.floor( ( Math.random() * 9000 ) + 1000 );
    req.session.otp = null;
    email_otp( email, otp );
    req.session.otp = { value: otp, email: email };
    setTimeout( () =>
    {
        if ( req.session.otp )
        {
            req.session.otp = null;
            console.log( `OTP obsolete at ${ new Date() }` );
        }
    }, 60000 );
    res.redirect( '/' );
} );

router.post( '/forget-password/change', async ( req, res ) =>
{
    const { email, new_password } = req.body;
    const [ user, hash ] = await Promise.all( [
        account_model.find_by_email( email ),
        bcrypt.hashSync( new_password, 10 ) ] );
    const password_entity = { u_ID: user.u_ID, u_Password: hash };
    await account_model.update_password( password_entity );
    res.redirect( req.headers.referer );
} );

router.get( '/otp-is-valid', ( req, res ) => res.json( req.session.otp !== null ) );

router.get( '/validate-otp', async ( req, res ) =>
{

    const otp = +req.query.otp,
        email = req.query.email;
    console.log( req.session.otp );
    console.log( `${ otp }-${ email }` );
    if ( email === req.session.otp.email && otp === req.session.otp.value )
    {
        req.session.otp = null;
        return res.json( true );
    }

    else return res.json( false );
} );

router.get( '/validate-email', async ( req, res ) =>
{
    const secret = req.query.key;
    const email = req.query.email;
    try
    {
        const is_correct_key = await bcrypt.compareSync( email, secret );
        if ( is_correct_key )
        {
            console.log( `email validated at ${ new Date().getTime() }` );
            req.session.is_validated_email = true;
            return res.json( true );
        }
        return res.json( false );
    }
    catch ( error ) { console.log( error ); }
} );

router.post( '/empty-history', account_auth, async ( req, res ) =>
{
    try
    {
        await account_model.empty_history( req.user.u_ID );
        res.json( true );
    } catch ( error ) { console.log( error ); res.json( false ); }
} );

router.post( '/delete-history', account_auth, async ( req, res ) =>
{
    try
    {
        console.log( req.body );
        const history_id = req.body.history_id;
        await account_model.delete_history( history_id );
        res.json( true );
    }
    catch ( error ) { console.log( error ); res.json( false ); }
} );

router.get( '/history', account_auth, async ( req, res ) =>
{
    try
    {
        const history = await account_model.history( req.user.u_ID );
        for ( const record of history )
            record.h_Time = moment( record.h_Time, 'YYYY-MM-DD HH:mm:ss' ).format( 'DD/MM/YYYY HH:mm:ss' );

        res.render( 'vwAccount/history', {
            banner: 'History',
            history,
            is_empty: history.length === 0
        } );
    }
    catch ( error ) { console.log( error ); res.redirect( req.headers.referer ); }
} );
router.get( '/likes', account_auth, async ( req, res ) =>
{
    try
    {
        const current_page = +req.query.page || 1;
        const offset = ( current_page - 1 ) * process.env.PAGINATION_LIMIT;
        const [ n_comics, comics ] = await Promise.all( [//topday
            account_model.n_likes( req.user.u_ID ),
            account_model.likes( req.user.u_ID, offset )
        ] );
        for ( const comic of comics )
            if ( comic.c_LastUpdate ) comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );
        const [ n_pages, page_items ] = pagination( n_comics, current_page );
        res.render( 'vwAccount/comics', {
            banner: 'Likes',
            link: '/account/likes?page=',
            comics,
            is_empty: comics.length === 0,
            current_page,
            page_items,
            n_pages,
        } );
    }
    catch ( error ) { console.log( error ); res.redirect( req.headers.referer ); }
} );
router.get( '/follows', account_auth, async ( req, res ) =>
{
    try
    {
        const current_page = +req.query.page || 1;
        const offset = ( current_page - 1 ) * process.env.PAGINATION_LIMIT;
        const [ n_comics, comics ] = await Promise.all( [//topday
            account_model.n_follows( req.user.u_ID ),
            account_model.follows( req.user.u_ID, offset )
        ] );
        for ( const comic of comics )
            if ( comic.c_LastUpdate ) comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );
        const [ n_pages, page_items ] = pagination( n_comics, current_page );
        res.render( 'vwAccount/comics', {
            banner: 'Follows',
            link: '/account/follows?page=',
            comics,
            is_empty: comics.length === 0,
            current_page,
            page_items,
            n_pages,
        } );
    }
    catch ( error ) { console.log( error ); res.redirect( req.headers.referer ); }
} );

router.post( '/request-publisher', account_auth, async ( req, res ) =>
{
    try
    {
        console.log( 'requesting...' );
        const request_entity = {
            u_ID: req.body.user_id,
            pr_Time: moment( new Date() ).format( 'YYYY-MM-DD HH:mm:ss' )
        };
        await account_model.request_publisher( request_entity );
        return res.json( true );
    }
    catch ( error ) { console.log( error ); return res.json( false ); }
} );


module.exports = router;