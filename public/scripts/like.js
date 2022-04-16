$( '#btn_like' ).on( 'click', () =>
{
    const user_id = $( '#btn_like' ).data( 'user-id' ),
        comic_id = $( '#btn_like' ).data( 'comic-id' ),
        like_status = $( '#btn_like' ).data( 'like-status' ),
        current_likes = $( '#comic_likes' ).text();
    const url = like_status === true ? '/comic/dislike' : '/comic/like';
    $.post( url,
        { user_id, comic_id },
        'json'
    ).done( data =>
    {
        if ( data )
        {
            const new_like_status = !like_status;
            $( '#btn_like' ).data( 'like-status', new_like_status );
            if ( new_like_status )
            {
                if ( current_likes != 'Updating' )
                    $( '#comic_likes' ).text( +current_likes + 1 );
                $( '#btn_like' ).html( `<i class="bi bi-hand-thumbs-down mx-2"></i>Dislike` );
            }
            else
            {
                if ( current_likes != 'Updating' )
                    $( '#comic_likes' ).text( +current_likes - 1 );
                $( '#btn_like' ).html( `<i class="bi bi-hand-thumbs-up mx-2"></i>Like` );
            }
        }
    } );
} );