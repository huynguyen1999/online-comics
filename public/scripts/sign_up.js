$( '#signup_dob' ).datetimepicker( {
    format: 'd/m/Y',
    timepicker: false,
    datepicker: false,
    mask: true,
    value: '28/07/1999',
} );

$( '#form_signup' ).on( 'submit', e =>
{
    e.preventDefault();
    const username = $( '#signup_username' ).val();
    if ( !username.length )
    {
        alert( 'Invalid data!' );
        return;
    }
    const email = $( '#signup_email' ).val();
    $.getJSON( `/account/is-available?user=${ username }&email=${ email }`, data =>
    {
        if ( data )
            $( '#form_signup' ).off( 'submit' ).submit();
        else
            alert( 'Username or Email already existed!' );
    } );
} );