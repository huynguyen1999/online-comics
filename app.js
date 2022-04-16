const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const passport = require( 'passport' );
require( 'dotenv' ).config();
const app = express();
//
app.use( bodyParser.json() );
app.use( bodyParser.text() );
app.use( express.urlencoded( {
    extended: true
} ) );
app.use( '/public', express.static( 'public' ) );

//
require( './middlewares/session.mdw' )( app );
app.use( passport.initialize() );
app.use( passport.session() );
//
require( './middlewares/view.mdw' )( app );
require( './middlewares/locals.mdw' )( app );
require( './middlewares/routes.mdw' )( app );
require( './middlewares/error.mdw' )( app );
//
const PORT = process.env.PORT || 3000;
app.listen( PORT, _ => console.log( `Example app listening at http://localhost:${ PORT }` ) );
