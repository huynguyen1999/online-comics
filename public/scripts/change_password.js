$( '#form_change_password' ).submit( event =>
{
    event.preventDefault();
    const current_password = $( '#current_password' ).val(),
        confirm_password = $( '#confirm_password' ).val(),
        new_password = $( '#new_password' ).val();
    if ( confirm_password !== new_password )
    {
        alert( 'new != confirm -_-' );
        return;
    }
    $.getJSON( `/account/is-correct-password?password=${ current_password }`,
        data =>
        {
            if ( data === false )
            {
                alert( 'Current password is wrong!' );
                return;
            }
            else
                $( '#form_change_password' ).off( 'submit' ).submit();

        } );

} );