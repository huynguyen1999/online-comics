require( 'dotenv' ).config();

module.exports = ( n_items, current_page ) =>
{
    const n_pages = Math.ceil( n_items / process.env.PAGINATION_LIMIT );
    const from_page = ( current_page - 3 ) > 0 ? ( current_page - 3 ) : 1;
    const to_page = ( current_page + 3 ) > n_pages ? n_pages : ( current_page + 3 );
    const page_items = [];
    for ( let i = from_page; i <= to_page; i += 1 )
    {
        page_items.push( { item: i } );
        if ( i === current_page )
            page_items[ page_items.length - 1 ].is_active = true;
    }
    return [ n_pages, page_items ];
};