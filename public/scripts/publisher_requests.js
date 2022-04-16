$( document ).on( 'click', '.btn-accept', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const user_id = current_element.data( 'user-id' );
    const user_email = current_element.data( 'user-email' );
    const user_row = current_element.parentsUntil( 'tbody' );
    $.post( '/admin/promote-reader', { user_id: user_id, user_email: user_email }, 'json' ).done(
        data =>
        {
            if ( data )
            {
                user_row.remove();
                alert( `Promote user with ID = ${ user_id } to publisher` );
            }
            else alert( 'Failed promotion!' );
        }
    );
} );

$( document ).on( 'click', '.btn-reject', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const user_id = current_element.data( 'user-id' );
    const user_row = current_element.parentsUntil( 'tbody' );
    const user_email = current_element.data( 'user-email' );
    $.post( '/admin/reject-request', { user_id: user_id, user_email: user_email }, 'json' ).done(
        data =>
        {
            if ( data )
            {
                user_row.remove();
                alert( `Request from user with ID = ${ user_id } has been rejected!` );
            }
            else alert( 'Failed rejection!' );
        }
    );
} );