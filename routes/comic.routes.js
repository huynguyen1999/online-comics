const express = require( 'express' );
const comics_model = require( '../models/comics.model' );
const router = express.Router();
const moment = require( 'moment' );
const account_auth = require( '../middlewares/account_auth.mdw' );
const account_model = require( '../models/account.model' );
const tag_model = require( '../models/tags.model' );
const publisher_model = require( '../models/publisher.model' );
const fs = require( 'fs' );
require( 'dotenv' ).config();

router.get( '/:comic_id/other-tags', async ( req, res ) =>
{
    try
    {
        const comic_id = +req.params[ 'comic_id' ];
        const other_tags = await tag_model.get_other_tags( comic_id );
        console.log( other_tags );
        return res.json( other_tags );
    }
    catch ( error )
    {
        console.log( error );
        return res.json( false );
    }
} );

router.get( '/:comic_id/latest_chapter', async ( req, res ) =>
{
    try
    {
        const comic_id = req.params[ 'comic_id' ];
        const latest_chapter = await comics_model.get_latest_chapter( comic_id );
        return res.json( { latest_chapter: latest_chapter } );
    }
    catch ( error )
    {
        console.log( error );
        return res.json( false );
    }
} );

router.get( '/:comic_id', async ( req, res ) =>
{
    try
    {
        const c_ID = +req.params[ 'comic_id' ];
        const [ comic, comic_chapters, comic_comments, comic_tags ] = await Promise.all( [
            comics_model.single( c_ID ),
            comics_model.all_chapters( c_ID ),
            comics_model.get_comments_of_comic( c_ID ),
            tag_model.get_tags_of_comic( c_ID )
        ] );
        // console.log( comic );
        let like_status = 0, follow_status = 0;
        if ( req.isAuthenticated() )
            [ like_status, follow_status ] = await Promise.all( [
                account_model.check_like( req.user.u_ID, c_ID ),
                account_model.check_follow( req.user.u_ID, c_ID )
            ] );
        for ( const cm of comic_comments )
            cm.cmt_Time = moment( cm.cmt_Time ).format( 'DD/MM/YYYY HH:mm:ss' );

        if ( comic_chapters )
            for ( const chapter of comic_chapters )
                chapter.ch_Update = moment( chapter.ch_Update, 'YYYY-MM-DD' ).format( 'DD/MM/YYYY' );

        let is_editible = false;
        if ( req.session.role === 'admin' )
            is_editible = true;
        if ( req.session.role === 'publisher' )
            is_editible = await publisher_model.is_editible( req.user.u_ID, c_ID );
        console.log( is_editible );
        console.log( req.session.role );
        res.render( 'vwComic/index', {
            comic,
            comic_tags,
            comic_chapters,
            like_status,
            follow_status,
            comic_comments,
            last_chapter: comic_chapters[ 0 ] || null,
            first_chapter: comic_chapters[ comic_chapters.length - 1 ] || null,
            current_chapter: comic_chapters[ 0 ] || null,
            is_editible
        } );
    } catch ( error ) { console.log( error ); }
} );

router.get( '/:comic_id/:chapter_id', async ( req, res ) =>
{
    try
    {
        const comic_id = req.params[ 'comic_id' ];
        const chapter_id = req.params[ 'chapter_id' ];
        const today = moment( new Date() ).format( 'YYYY-MM-DD' );

        const [ current_chapter, comic_chapters, current_comic, comic_comments, view_date ] = await Promise.all( [
            comics_model.get_chapter( chapter_id ),
            comics_model.all_chapters( comic_id ),
            comics_model.single( comic_id ),
            comics_model.get_comments_of_comic( comic_id ),
            comics_model.view_by_date( today, comic_id )
        ] );

        const prev_chapter = comic_chapters.find( chap => ( chap.ch_ID + 1 ) == current_chapter.ch_ID ),
            next_chapter = comic_chapters.find( chap => ( chap.ch_ID - 1 ) == current_chapter.ch_ID );

        if ( req.isAuthenticated() )
        {
            const history_entity = {
                c_ID: comic_id, ch_ID: chapter_id,
                u_ID: req.user.u_ID,
                h_Time: moment( new Date() ).format( 'YYYY-MM-DD HH:mm:ss' )
            };
            await account_model.make_history( history_entity );
        }
        await comics_model.increase_view( comic_id, view_date );

        for ( const cm of comic_comments )
            cm.cmt_Time = moment( cm.cmt_Time ).format( 'DD/MM/YYYY HH:mm:ss' );
        // load chapter images    
        const chapter_path = `${ process.cwd() }/public/${ comic_id }/${ current_chapter.ch_No }`;
        await fs.promises.access( chapter_path );

        let files = fs.readdirSync( chapter_path );
        let comic_images = [];

        files = Array.from( files ).sort( ( a, b ) =>
        {
            const num_a = a.split( '.' )[ 0 ];
            const num_b = b.split( '.' )[ 0 ];
            return num_a - num_b;
        } );
        for ( const file_path of files )
            comic_images.push( { path: file_path } );

        res.render( 'vwComic/chapter', {
            comic_chapters,
            current_chapter,
            comic_images,
            current_comic,
            comic_comments,
            prev_chapter,
            next_chapter,
            last_chapter: comic_chapters[ 0 ]
        } );
    } catch ( error )
    {
        console.log( error );
        res.redirect( '/' );
    }
} );

router.post( '/like', account_auth, async ( req, res ) =>
{
    try
    {
        const { user_id, comic_id } = req.body;
        const like_entity = {
            u_ID: user_id,
            c_ID: comic_id
        };
        await account_model.like( like_entity );
        res.json( true );
    } catch ( error )
    {
        console.log( error );
        res.json( false );
    }
} );

router.post( '/follow', account_auth, async ( req, res ) =>
{
    try
    {
        const { user_id, comic_id } = req.body;
        const follow_entity = { u_ID: user_id, c_ID: comic_id };
        await account_model.follow( follow_entity );
        res.json( true );
    }
    catch ( error ) { console.log( error ); res.json( false ); }
} );

router.post( '/comment', account_auth, async ( req, res ) =>
{
    try
    {
        const { user_id, chapter_id, comment_text } = req.body;
        const comment_entity = {
            u_ID: user_id,
            ch_ID: chapter_id,
            cmt_Text: comment_text,
            cmt_Time: moment( new Date(), 'MMMM/DD/YYYY HH:mm:ss' ).format( 'YYYY-MM-DD HH:mm:ss' )
        };
        const insert_info = await account_model.comment( comment_entity );
        const chapter = await comics_model.get_chapter( chapter_id );

        comment_entity.cmt_Time = moment( comment_entity.cmt_Time ).format( 'MM/DD/YYYY HH:mm:ss' );
        comment_entity.comment_id = insert_info.insertId;
        comment_entity.ch_No = chapter.ch_No;
        comment_entity.user_name = req.user.u_Name;

        return res.json( comment_entity );
    } catch ( error ) { console.log( error ); res.json( false ); }
} );

router.post( '/dislike', account_auth, async ( req, res ) =>
{
    try
    {
        const { user_id, comic_id } = req.body;
        const dislike_entity = { u_ID: user_id, c_ID: comic_id };
        await account_model.dislike( dislike_entity );
        res.json( true );
    }
    catch ( error )
    {
        console.log( error );
        res.json( false );
    }
} );

router.post( '/unfollow', account_auth, async ( req, res ) =>
{
    try
    {
        const { user_id, comic_id } = req.body;
        const unfollow_entity = { u_ID: user_id, c_ID: comic_id };
        await account_model.unfollow( unfollow_entity );
        res.json( true );
    }
    catch ( error ) { console.log( error ); res.json( false ); }
} );

router.post( '/uncomment', account_auth, async ( req, res ) =>
{
    try
    {
        await account_model.uncomment( { cmt_ID: req.body.cmt_ID } );
        return res.json( true );
    } catch ( error ) { console.log( error ); return res.json( false ); }
} );

router.post( '/edit-comment', account_auth, async ( req, res ) =>
{
    try
    {
        console.log( req.body );
        await account_model.edit_comment( {
            cmt_ID: req.body.cmt_ID,
            cmt_Text: req.body.cmt_Text
        } );
        return res.json( true );
    }
    catch ( error ) { console.log( error ); return res.json( false ); }
} );

module.exports = router;