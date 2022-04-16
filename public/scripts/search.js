$( '#search_bar' ).autocomplete( {
    source: ( req, res ) =>
    {
        const key = $( '#search_bar' ).val();
        $.getJSON( `/search?key=${ key }` )
            .done( data =>
            {
                let comic_list = [];
                for ( const comic of data.comics )
                    comic_list.push( { label: comic.c_Name, href: `/comic/${ comic.c_ID }` } );
                // console.log( data );
                res( comic_list );
            } );
    },
    select: ( event, ui ) =>
    {
        console.log( ui );
        window.location.href = ui.item.href;
    }
}, { delay: 500, autoFocus: true } );