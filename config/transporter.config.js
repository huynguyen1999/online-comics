require( 'dotenv' ).config();

const nodemailer = require( "nodemailer" );
const transporter = nodemailer.createTransport( {
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,			//email ID
        pass: process.env.EMAIL_PASSWORD		//password
    }
} );
module.exports = transporter;