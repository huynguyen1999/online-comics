$( '#btn_follow' ).on( 'click', () =>
{
    const user_id = $( '#btn_follow' ).data( 'user-id' ),
        comic_id = $( '#btn_follow' ).data( 'comic-id' ),
        follow_status = $( '#btn_follow' ).data( 'follow-status' ),
        current_follows = +$( '#comic_follows' ).text();
    const url = follow_status === true ? '/comic/unfollow' : '/comic/follow';
    $.post( url,
        { user_id, comic_id },
        'json'
    ).done( data =>
    {
        if ( data )
        {
            const new_follow_status = !follow_status;
            $( '#btn_follow' ).data( 'follow-status', new_follow_status );
            if ( new_follow_status )
            {
                if ( current_follows != 'Updating' )
                    $( '#comic_follows' ).text( +current_follows + 1 );
                $( '#btn_follow' ).html( `<i class="bi bi-bookmark-fill mx-2"></i>Unfollow` );
            }
            else
            {
                if ( current_follows != 'Updating' )
                    $( '#comic_follows' ).text( +current_follows - 1 );
                $( '#btn_follow' ).html( `<i class="bi bi-bookmark mx-2"></i>Follow` );
            }

        }
    } );
} );