const tags_model = require( '../models/tags.model' );
const moment = require( 'moment' );

module.exports = app =>
{
    app.use( async ( req, res, next ) =>
    {
        res.locals.is_auth = req.isAuthenticated();
        res.locals.auth_user = req.user;
        if ( res.locals.is_auth )
            res.locals.auth_user.u_DOB = moment( res.locals.auth_user.u_DOB, 'YYYY-MM-DD' ).format( 'DD/MM/YYYY' );

        res.locals.is_reader = req.session.role === 'reader';
        res.locals.is_publisher = req.session.role === 'publisher';
        res.locals.is_admin = req.session.role === 'admin';
        const all_tags = await tags_model.all_tags();
        res.locals.all_tags = all_tags;
        next();
    } );
};