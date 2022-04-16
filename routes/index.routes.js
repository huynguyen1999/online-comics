const express = require( 'express' );
const comics_model = require( '../models/comics.model' );
const router = express.Router();
const dt_util = require( '../utils/datetime' );
const pagination = require( '../utils/pagination' );
require( 'dotenv' ).config();

router.get( '/', async ( req, res ) =>
{
    try
    {
        const [ top_views, new_uploads ] = await Promise.all( [
            comics_model.top_views(),
            comics_model.new_updates( 0 ) ] );

        for ( const comic of top_views )
            if ( comic.c_LastUpdate )
                comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );
        for ( const comic of new_uploads )
            if ( comic.c_LastUpdate )
                comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );

        res.render( 'vwIndex/home', {
            top_views,
            new_uploads
        } );
    }
    catch ( err ) { console.log( err ); }
} );


router.get( '/new-updates', async ( req, res ) =>
{
    try
    {
        const current_page = +req.query.page || 1;
        const offset = ( current_page - 1 ) * process.env.PAGINATION_LIMIT;
        const [ n_comics, new_updates ] = await Promise.all( [
            comics_model.n_comics(),
            comics_model.new_updates( offset )
        ] );
        for ( const comic of new_updates )
            if ( comic.c_LastUpdate ) comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );

        const [ n_pages, page_items ] = pagination( n_comics, current_page );
        res.render( 'vwIndex/new_updates', {
            link: '/new-updates?page=',
            comics: new_updates,
            is_empty: new_updates.length === 0,
            current_page,
            page_items,
            n_pages,
        } );
    } catch ( error ) { console.log( error ); }
} );



router.get( '/search', async ( req, res ) =>
{
    try
    {
        const key = req.query.key;
        const rows = await comics_model.search( key );
        res.json( { comics: rows } );
    }
    catch ( error ) { console.log( error ); res.json( false ); }
} );


module.exports = router;