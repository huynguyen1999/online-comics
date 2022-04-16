const express = require( 'express' );
const router = express.Router();
const moment = require( 'moment' );
const comics_model = require( '../models/comics.model' );
const pagination = require( '../utils/pagination' );
const dt_util = require( '../utils/datetime' );
require( 'dotenv' ).config();

router.get( '/day', async ( req, res ) =>
{
    try
    {
        const current_page = +req.query.page || 1;
        const offset = ( current_page - 1 ) * process.env.PAGINATION_LIMIT;
        const [ n_comics, top_day ] = await Promise.all( [//topday
            comics_model.n_comics(),
            comics_model.top_day( offset )
        ] );
        console.log( top_day );
        for ( const comic of top_day )
            if ( comic.c_LastUpdate ) comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );

        const [ n_pages, page_items ] = pagination( n_comics, current_page );
        return res.render( 'vwRanking/index', {
            banner: 'Top View Today',
            link: '/ranking/day?page=',
            comics: top_day,
            is_empty: top_day.length === 0,
            current_page,
            page_items,
            n_pages,
        } );
    } catch ( error ) { console.log( error ); res.redirect( req.headers.referer ); }
} );

router.get( '/week', async ( req, res ) =>
{
    try
    {
        const current_page = +req.query.page || 1;
        const offset = ( current_page - 1 ) * process.env.PAGINATION_LIMIT;
        const [ n_comics, top_week ] = await Promise.all( [
            comics_model.n_comics(),
            comics_model.top_week( offset )
        ] );
        console.log( top_week );
        for ( const comic of top_week )
            if ( comic.c_LastUpdate ) comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );

        const [ n_pages, page_items ] = pagination( n_comics, current_page );
        return res.render( 'vwRanking/index', {
            banner: 'Top View This Week',
            link: '/ranking/week?page=',
            comics: top_week,
            is_empty: top_week.length === 0,
            current_page,
            page_items,
            n_pages,
        } );
    } catch ( error ) { console.log( error ); res.redirect( req.headers.referer ); }
} );

router.get( '/month', async ( req, res ) =>
{
    try
    {
        const current_page = +req.query.page || 1;
        const offset = ( current_page - 1 ) * process.env.PAGINATION_LIMIT;
        const [ n_comics, top_month ] = await Promise.all( [//topday
            comics_model.n_comics(),
            comics_model.top_month( offset )
        ] );
        console.log( top_month );
        for ( const comic of top_month )
            if ( comic.c_LastUpdate ) comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );

        const [ n_pages, page_items ] = pagination( n_comics, current_page );
        return res.render( 'vwRanking/index', {
            banner: 'Top View This Month',
            link: '/ranking/month?page=',
            comics: top_month,
            is_empty: top_month.length === 0,
            current_page,
            page_items,
            n_pages,
        } );
    } catch ( error ) { console.log( error ); res.redirect( req.headers.referer ); }
} );

router.get( '/likes', async ( req, res ) =>
{
    try
    {
        const current_page = +req.query.page || 1;
        const offset = ( current_page - 1 ) * process.env.PAGINATION_LIMIT;
        const [ n_comics, top_likes ] = await Promise.all( [//topday
            comics_model.n_comics(),
            comics_model.top_likes( offset )
        ] );

        for ( const comic of top_likes )
            if ( comic.c_LastUpdate ) comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );

        const [ n_pages, page_items ] = pagination( n_comics, current_page );
        return res.render( 'vwRanking/index', {
            banner: 'Top Likes',
            link: '/ranking/likes?page=',
            comics: top_likes,
            is_empty: top_likes.length === 0,
            current_page,
            page_items,
            n_pages,
        } );
    } catch ( error ) { console.log( error ); res.redirect( req.headers.referer ); }
} );

router.get( '/follows', async ( req, res ) =>
{
    try
    {
        const current_page = +req.query.page || 1;
        const offset = ( current_page - 1 ) * process.env.PAGINATION_LIMIT;
        const [ n_comics, top_follows ] = await Promise.all( [//topday
            comics_model.n_comics(),
            comics_model.top_follows( offset )
        ] );

        for ( const comic of top_follows )
            if ( comic.c_LastUpdate ) comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );

        const [ n_pages, page_items ] = pagination( n_comics, current_page );
        return res.render( 'vwRanking/index', {
            banner: 'Top Follows',
            link: '/ranking/follows?page=',
            comics: top_follows,
            is_empty: top_follows.length === 0,
            current_page,
            page_items,
            n_pages,
        } );
    } catch ( error ) { console.log( error ); res.redirect( req.headers.referer ); }
} );

router.get( '/new-uploads', async ( req, res ) =>
{
    try
    {
        const current_page = +req.query.page || 1;
        const offset = ( current_page - 1 ) * process.env.PAGINATION_LIMIT;
        const [ n_comics, new_uploads ] = await Promise.all( [//topday
            comics_model.n_comics(),
            comics_model.new_uploads( offset )
        ] );
        console.log( new_uploads );
        for ( const comic of new_uploads )
            if ( comic.c_LastUpdate ) comic.c_LastUpdate = dt_util.secondsToHms( comic.c_LastUpdate );

        const [ n_pages, page_items ] = pagination( n_comics, current_page );
        return res.render( 'vwRanking/index', {
            banner: 'New Uploads',
            link: '/ranking/new-uploads?page=',
            comics: new_uploads,
            is_empty: new_uploads.length === 0,
            current_page,
            page_items,
            n_pages,
        } );
    } catch ( error ) { console.log( error ); res.redirect( req.headers.referer ); }
} );


module.exports = router;