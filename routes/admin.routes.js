const express = require( 'express' );
const router = express.Router();
// const account_model = require( '../models/account.model' );
const tag_model = require( '../models/tags.model' );
const account_auth = require( '../middlewares/account_auth.mdw' );
const admin_model = require( '../models/admin.model' );
const { admin_authorization } = require( '../middlewares/account_authorization.mdw' );
const moment = require( 'moment' );
const passport = require( '../config/passport.config' );
const { request } = require( 'express' );
const transporter = require( '../config/transporter.config' );

router.get( '/', ( req, res ) => res.redirect( '/admin/user-management' ) );

router.get( '/user-management', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            const users = await admin_model.get_users();
            for ( const user of users )
                user.u_Role = user.u_IsAdmin ? 'Admin' :
                    ( user.u_IsPublisher ? 'Publisher' : 'Reader' );

            res.render( 'vwAdmin/user-management', {
                is_user_management: true,
                users,
                is_empty: users.length === 0
            } );
        } catch ( error )
        {
            console.log( error );
            res.redirect( req.headers.referer );
        }
    } );

router.post( '/ban-user', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            console.log( req.body );
            const user_id = req.body.user_id,
                user_email = req.body.user_email;
            await admin_model.ban_user( user_id );
            transporter.sendMail( {
                from: '"Online Comics 👻" conghuyawesome1999@gmail.com', // sender address
                to: user_email, // list of receivers
                subject: "Banned your account ✔", // Subject line
                html: "<p>Your account has been banned for suspicious activities!</p>"
            } );
            res.json( true );
        }
        catch ( error )
        {
            console.log( error );
            res.json( false );
        }
    } );

router.post( '/unban-user', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            console.log( req.body );
            const user_id = req.body.user_id;
            await admin_model.unban_user( user_id );
            res.json( true );
        }
        catch ( error )
        {
            console.log( error );
            res.json( false );
        }
    } );

router.post( '/demote-publisher', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            const user_id = req.body.user_id,
                user_email = req.body.user_email;
            await admin_model.demote_user( user_id );
            transporter.sendMail( {
                from: '"Online Comics 👻" conghuyawesome1999@gmail.com', // sender address
                to: user_email, // list of receivers
                subject: "Demoted from publisher to reader✔", // Subject line
            } );
            res.json( true );
        } catch ( error )
        {
            console.log( error );
            res.json( false );
        }
    } );

router.post( '/promote-reader', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            const user_id = req.body.user_id,
                user_email = req.body.user_email;
            console.log( user_email );
            await admin_model.promote_user( user_id );
            await admin_model.reject_request( user_id );
            transporter.sendMail( {
                from: '"Online Comics 👻" conghuyawesome1999@gmail.com', // sender address
                to: user_email, // list of receivers
                subject: "Promoted from reader to publisher!", // Subject line
            } );
            res.json( true );
        } catch ( error )
        {
            console.log( error );
            res.json( false );
        }
    } );

router.post( '/remove-user', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            const user_id = req.body.user_id,
                user_email = req.body.user_email;
            await admin_model.remove_user( user_id );
            transporter.sendMail( {
                from: '"Online Comics 👻" conghuyawesome1999@gmail.com', // sender address
                to: user_email, // list of receivers
                subject: "Account has been deleted!✔", // Subject line
            } );
            res.json( true );
        } catch ( error )
        {
            console.log( error );
            res.json( false );
        }
    } );

router.get( '/publisher-requests', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            const requests = await admin_model.get_pending_requests();
            console.log( requests.length );
            res.render( 'vwAdmin/publisher-requests', {
                is_publisher_requests: true,
                requests,
                is_empty: requests.length === 0
            } );
        }
        catch ( error )
        {
            console.log( error );
            res.redirect( req.headers.referer );
        }
    } );

router.post( '/reject-request', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            const user_id = req.body.user_id,
                user_email = req.body.user_email;
            console.log( user_email );
            await admin_model.reject_request( user_id );
            transporter.sendMail( {
                from: '"Online Comics 👻" conghuyawesome1999@gmail.com', // sender address
                to: user_email, // list of receivers
                subject: "Request has been rejected!✔", // Subject line
                html: `<p>fuck you</p>`
            }, ( error, info ) =>
            {
                if ( error )
                {
                    console.log( error );
                    return;
                }
                console.log( 'Message sent' );
                transporter.close();
            } );
            res.json( true );
        }
        catch ( error )
        {
            console.log( error );
            res.json( false );
        }
    } );


router.get( '/tag-management', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            res.render( 'vwAdmin/tag-management', {
                is_tag_management: true,
                is_empty: res.locals.all_tags.length === 0
            } );
        }
        catch ( error )
        {
            console.log( error );
            res.redirect( req.headers.referer );
        }
    } );

router.post( '/update-tag', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            console.log( 'cailoljvtr' );
            const tag_entity = { t_ID: req.body.tag_id, t_Name: req.body.tag_name };
            console.log( tag_entity );
            await tag_model.update_tag( tag_entity );
            return res.json( true );
        }
        catch ( error )
        {
            console.log( error );
            return res.json( false );
        }
    } );

router.post( '/add-tag', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            console.log( 'add-tag' );
            const tag_name = req.body.tag_name;
            const info = await tag_model.add_tag( { t_Name: tag_name } );
            console.log( info );
            res.json( info );
        }
        catch ( error )
        {
            console.log( error );
            res.json( false );
        }
    } );

router.post( '/remove-tag', account_auth, admin_authorization,
    async ( req, res ) =>
    {
        try
        {
            console.log( 'remove-tag' );
            const tag_id = req.body.tag_id;
            await tag_model.remove_tag( tag_id );
            res.json( true );
        } catch ( error )
        {
            console.log( error );
            res.json( false );
        }
    } );
module.exports = router;