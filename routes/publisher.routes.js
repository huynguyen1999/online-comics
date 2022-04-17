const express = require( 'express' );
const router = express.Router();
const account_model = require( '../models/account.model' );
const account_auth = require( '../middlewares/account_auth.mdw' );
const { publisher_authorization, non_reader_authorization } = require( '../middlewares/account_authorization.mdw' );
const moment = require( 'moment' );
const publisher_model = require( '../models/publisher.model' );
const passport = require( '../config/passport.config' );
const authors_model = require( '../models/authors.model' );
const fs = require( 'fs' );

router.post( '/edit-name', non_reader_authorization, async ( req, res ) =>
{
    try
    {
        const { comic_id, comic_name } = req.body;
        const entity = { c_ID: req.body.comic_id, c_Name: req.body.comic_name };
        await Promise.all(
            [ publisher_model.edit_name( entity ),
            publisher_model.remove_suffixes( comic_id ) ] );
        await publisher_model.add_suffixes( comic_id, comic_name );
        res.json( true );
    }
    catch ( error )
    {
        console.log( error );
        res.json( false );
    }
} );
router.post( '/edit-author', non_reader_authorization, async ( req, res ) =>
{
    try
    {
        console.log( req.body );
        const author_name = req.body.author_name;
        const comic_id = req.body.comic_id;
        const author = await authors_model.find_by_name( author_name );
        if ( author )
        {
            await authors_model.update_comic_author( { a_ID: author.a_ID, c_ID: comic_id } );
            return res.json( { new_author_id: author.a_ID } );
        }
        else
        {
            const info = await authors_model.add_author( { a_Name: author_name } );
            await authors_model.update_comic_author( { a_ID: info.insertId, c_ID: comic_id } );
            return res.json( { new_author_id: info.insertId } );
        }
    }
    catch ( error )
    {
        console.log( error );
        res.json( false );
    }
} );

router.post( '/edit-status', non_reader_authorization, async ( req, res ) =>
{
    try
    {
        const entity = { c_ID: req.body.comic_id, c_Status: req.body.status_id };
        await publisher_model.edit_status( entity );
        res.json( true );
    }
    catch ( error )
    {
        console.log( error );
        res.json( false );
    }
} );

router.post( '/edit-likes', non_reader_authorization, async ( req, res ) =>
{
    try
    {
        const entity = { c_ID: req.body.comic_id, c_Likes: req.body.comic_likes };
        await publisher_model.edit_likes( entity );
        res.json( true );
    }
    catch ( error )
    {
        console.log( error );
        res.json( false );
    }
} );

router.post( '/edit-follows', non_reader_authorization, async ( req, res ) =>
{
    try
    {
        const entity = { c_ID: req.body.comic_id, c_Follows: req.body.comic_follows };
        await publisher_model.edit_follows( entity );
        res.json( true );
    }
    catch ( error )
    {
        console.log( error );
        res.json( false );
    }
} );

router.post( '/remove-tag', non_reader_authorization, async ( req, res ) =>
{
    try
    {
        console.log( req.body );
        const { tag_id, comic_id } = req.body;
        await publisher_model.remove_tag( tag_id, comic_id );
        return res.json( true );
    }
    catch ( error )
    {
        console.log( error );
        return res.json( false );
    }
} );

router.post( '/add-tag', non_reader_authorization, async ( req, res ) =>
{
    try
    {
        console.log( req.body );
        const comic_id = req.body.comic_id,
            new_tags = req.body.new_tags;
        for ( const tag of new_tags )
        {
            const tag_id = tag.split( '-' )[ 0 ];
            const entity = { c_ID: comic_id, t_ID: +tag_id };
            await publisher_model.add_tag( entity );
        }
        res.json( true );
    }
    catch ( error )
    {
        console.log( error );
        res.json( false );
    }

} );

router.post( '/edit-description', non_reader_authorization, async ( req, res ) =>
{
    try
    {
        const description = req.body.description,
            comic_id = req.body.comic_id;
        await publisher_model.edit_description( { c_Description: description, c_ID: comic_id } );
        return res.json( true );
    }
    catch ( error )
    {
        console.log( error );
        return res.json( false );
    }
} );

router.post( '/remove-chapter', non_reader_authorization, async ( req, res ) =>
{
    try
    {
        console.log( req.body );
        const comic_id = req.body.comic_id,
            chapter_id = req.body.chapter_id,
            chapter_no = req.body.chapter_no;
        const path = process.cwd() + `/public/${ comic_id }/${ chapter_no }`;
        await fs.rmSync( path, { recursive: true, force: true } );
        await publisher_model.remove_chapter( chapter_id );
        console.log( path );
        return res.json( true );
    }
    catch ( error )
    {
        console.log( error );
        return res.json( false );
    }
} );

router.post( '/remove-comic', non_reader_authorization, async ( req, res ) =>
{
    try
    {
        console.log( req.body );
        const comic_id = req.body.comic_id,
            user_id = req.body.user_id;
        await publisher_model.remove_comic( user_id, comic_id );
        res.json( true );
    }
    catch ( error )
    {
        console.log( error );
        res.json( false );
    }
} );

module.exports = router;