const check_validated_otp = () =>
{
    let time_run = 0;
    let interval = setInterval( () =>
    {
        time_run += 1;
        console.log( time_run );
        if ( time_run === 60 )
            clearInterval( interval );

        $.getJSON( '/account/otp-is-valid',
            data =>
            {
                if ( data )
                {
                    if ( $( '#form_otp' ).is( ':hidden' ) )
                        $( '#form_otp' ).show();
                    if ( $( '#btn_send_otp' ).is( ':visible' ) )
                        $( '#btn_send_otp' ).hide();
                    if ( $( '#btn_validate_otp' ).is( ':hidden' ) )
                        $( '#btn_validate_otp' ).show();
                    clearInterval( interval );
                }
                else
                    alert( 'This OTP is expired, please resend!' );

            }
        );
    }, 1000 );
};

$( document ).ready( () =>
{
    $( '#form_otp' ).hide();
    $( '#form_change_password' ).hide();
    $( '#btn_validate_otp' ).hide();
    $( '#btn_change_password' ).hide();
} );


$( '#btn_send_otp' ).on( 'click', () =>
{
    const email = $( '#fp_email' ).val();
    $.post( '/account/forget-password', { fp_email: email } )
        .done( check_validated_otp );
} );

$( '#btn_validate_otp' ).on( 'click', () =>
{
    const my_otp = $( '#fp_otp' ).val(),
        my_email = $( '#fp_email' ).val();
    $.getJSON( `/account/validate-otp?otp=${ my_otp }&email=${ my_email }` )
        .done(
            data =>
            {
                if ( data )
                {
                    if ( $( '#form_change_password' ).is( ':hidden' ) )
                        $( '#form_change_password' ).show();
                    if ( $( '#btn_change_password' ).is( ':hidden' ) )
                        $( '#btn_change_password' ).show();
                    if ( $( '#form_otp' ).is( ':visible' ) )
                        $( '#form_otp' ).hide();
                    if ( $( '#btn_send_otp' ).is( ':visible' ) )
                        $( '#btn_send_otp' ).hide();
                    if ( $( '#btn_validate_otp' ).is( ':visible' ) )
                        $( '#btn_validate_otp' ).hide();
                }
                else alert( 'Wrong OTP my friend!' );
            }
        );
} );

$( '#btn_change_password' ).on( 'click', () =>
{
    $.post( '/account/forget-password/change',
        { email: $( '#fp_email' ).val(), new_password: $( '#fp_new_password' ).val() },
        data => location.reload() );
} );



