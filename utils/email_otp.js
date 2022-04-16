const bcrypt = require( 'bcryptjs' );
const transporter = require( '../config/transporter.config' );

module.exports = ( email, otp ) =>
{
    transporter.sendMail( {
        from: '"Online Comics 👻" conghuyawesome1999@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Change your password ✔", // Subject line
        html: `<p>Don't waste your life scrolling tiktok, waste your life on our website reading comics như 1 thằng ngốc instead!</p>
        <p>Your OTP code is: ${ otp }</p>`,
    } );
};

