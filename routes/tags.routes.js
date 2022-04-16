const express = require( 'express' );
const { process_params } = require( 'express/lib/router' );
const comics_model = require( '../models/comics.model' );
const tags_model = require( '../models/tags.model' );
const router = express.Router();
const dt_util = require( '../utils/datetime' );
const pagination = require( '../utils/pagination' );
require( 'dotenv' ).config();

router.get( '/:id', async ( req, res ) =>
{
    try
    {
        const sort_types = [ { id: 0, name: 'Recent Updates' },
        { id: 1, name: 'Old Updates' },
        { id: 2, name: 'Recent Uploads' },
        { id: 3, name: 'Old Uploads' },
        { id: 4, name: 'Most Views' },
        { id: 5, name: 'Least Views' } ];
        const current_page = +req.query.page || 1,
            status = +req.query.status || 0,
            sort = +req.query.sort || 0;
        console.log( status );
        const offset = ( current_page - 1 ) * process.env.PAGINATION_LIMIT;
        const tag_id = +req.params[ 'id' ];
        const [ tag, comics ] = await Promise.all( [
            tags_model.get_tag( tag_id ),
            tags_model.get_comics_of_tag( tag_id, status, sort, offset ) ] );
        for ( const comic of comics )
            if ( comic.c_LastUpdate )
                comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );

        const n_comics = comics.length;
        const [ n_pages, page_items ] = pagination( n_comics, current_page );
        res.render( 'vwTag/index', {
            link: '/tags?page=',
            comics,
            is_empty: n_comics == 0,
            current_page,
            n_pages,
            page_items,
            tag,
            status,
            current_sort: sort_types.find( elem => elem.id == sort ),
            sort_types
        } );
    } catch ( error ) { console.log( error ); }
} );

module.exports = router;