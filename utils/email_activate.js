const bcrypt = require( 'bcryptjs' );
const transporter = require( '../config/transporter.config' );

module.exports = user =>
{
    console.log( user );
    const secret = bcrypt.hashSync( user.u_Username, 10 );
    transporter.sendMail( {
        from: '"Online Comics 👻" conghuyawesome1999@gmail.com', // sender address
        to: user.u_Email, // list of receivers
        subject: "Activate your account ✔", // Subject line
        html: `<p>Don't waste your life scrolling tiktok, waste your life on our website reading comics như 1 thằng ngốc instead!</p>
        <p>Click <a href="http://localhost:3000/account/activate?key=${ secret }&u_Username=${ user.u_Username }&u_Password=${ user.u_Password }&u_DOB=${ user.u_DOB }&u_Name=${ user.u_Name }&u_Email=${ user.u_Email }">
        here</a> to active</p>`,
    } );
};