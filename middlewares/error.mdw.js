require( 'express-async-errors' );
module.exports = function ( app )
{
    app.use( ( req, res ) => res.render( 'vwError/404', { layout: false } ) );
    // default error handler
    app.use( ( err, req, res, next ) => res.render( 'vwError/500', { layout: false } ) );
};