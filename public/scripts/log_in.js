const login = () =>
{
    const login_username = $( '#li_username' ).val(),
        login_password = $( '#li_password' ).val();

    $.post( '/account/login', { username: login_username, password: login_password }, 'json' ).
        done( data =>
        {
            const message = data.message;
            if ( message )
            {
                alert( message );
                return;
            }
            else
                location.reload();
        } );
};