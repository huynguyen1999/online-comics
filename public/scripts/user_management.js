
$( document ).on( 'click', '.btn-ban', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();

    const user_id = current_element.data( 'user-id' ),
        user_email = current_element.data( 'user-email' );
    $.post( '/admin/ban-user', { user_id: user_id, user_email: user_email }, 'json' ).done( data =>
    {
        if ( data )
        {
            alert( `You have banned user with ID = ${ user_id } for 24 hours` );
            current_element.removeClass( 'btn-ban' ).addClass( 'btn-unban' );
            current_element.html(
                `<i class="bi bi-unlock-fill"></i>` );
        }
        else alert( `Failed ban! User with ID = ${ user_id } still active` );
    } );
} );

$( document ).on( 'click', '.btn-unban', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();

    const user_id = current_element.data( 'user-id' );
    $.post( '/admin/unban-user', { user_id: user_id }, 'json' ).done( data =>
    {
        if ( data )
        {
            alert( `You have unbanned user with ID = ${ user_id }!` );
            current_element.removeClass( 'btn-unban' ).addClass( 'btn-ban' );
            current_element.html(
                `<i class="bi bi-lock-fill"></i>` );
        }
        else alert( `Failed unban! User with ID = ${ user_id } still banned!` );
    } );
} );

$( document ).on( 'click', '.btn-demote', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const user_id = current_element.data( 'user-id' ),
        user_email = current_element.data( 'user-email' );
    const role_element = $( current_element ).parent().siblings( '.col-role' );
    console.log( role_element.html() );
    $.post( '/admin/demote-publisher', { user_id: user_id, user_email: user_email }, 'json' ).done(
        data =>
        {
            if ( data )
            {
                role_element.html( 'Reader' );
                current_element.html( '<i class="bi bi-arrow-up-right"></i>' );
                current_element.removeClass( 'btn-demote' ).addClass( 'btn-promote' );
                alert( `Demote user with ID = ${ user_id } to reader` );
            }
            else alert( 'Failed demotion!' );
        }
    );

} );

$( document ).on( 'click', '.btn-promote', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const user_id = current_element.data( 'user-id' ),
        user_email = current_element.data( 'user-email' );
    const role_element = $( current_element ).parent().siblings( '.col-role' );
    console.log( role_element.html() );
    $.post( '/admin/promote-reader', { user_id: user_id, user_email: user_email }, 'json' ).done(
        data =>
        {
            if ( data )
            {
                role_element.html( 'Publisher' );
                current_element.html( '<i class="bi bi-arrow-down-left"></i>' );
                current_element.removeClass( 'btn-promote' ).addClass( 'btn-demote' );
                alert( `Promote user with ID = ${ user_id } to publisher` );
            }
            else alert( 'Failed promotion!' );
        }
    );
} );

$( document ).on( 'click', '.btn-remove', event =>
{
    let current_element = $( event.target );
    if ( current_element.prop( 'tagName' ) != 'BUTTON' )
        current_element = current_element.parent();
    const user_id = current_element.data( 'user-id' ),
        user_email = current_element.data( 'user-email' );
    const user_row = current_element.parentsUntil( 'tbody' );
    $.post( '/admin/remove-user', { user_id: user_id, user_email: user_email }, 'json' ).done(
        data =>
        {
            if ( data )
            {
                user_row.remove();
                alert( `User with ID = ${ user_id } has been removed!` );
            }
            else alert( `Failed! User with ID = ${ user_id } still available!` );
        }
    );
} );