const express = require( 'express' );
const router = express.Router();
const dt_util = require( '../utils/datetime' );
const authors_model = require( '../models/authors.model' );


router.get( '/', async ( req, res ) =>
{
    try
    {   
    }
    catch ( error )
    {
        console.log( error );
        res.json( false );
    }
} );

router.post( '/add', async ( req, res ) =>
{

} );

router.get( '/:author_id', async ( req, res ) =>
{
    try
    {
        const author_id = +req.params[ 'author_id' ];

        const [ author, comics ] = await Promise.all( [
            authors_model.get_author( author_id ),
            authors_model.get_comics_of_author( author_id )
        ] );
        for ( const comic of comics )
            if ( comic.c_LastUpdate ) comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );

        // console.log( author );
        res.render( 'vwIndex/author', {
            author,
            comics,
            is_empty: comics.length === 0,
        } );

    } catch ( error ) { console.log( error ); res.redirect( req.headers.referer ); }
} );

module.exports = router;