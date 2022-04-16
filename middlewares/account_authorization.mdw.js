module.exports = {
    publisher_authorization: ( req, res, next ) =>
    {
        if ( req.session.role === 'publisher' )
            return next();
        else return res.redirect( '/' );
    },
    admin_authorization: ( req, res, next ) =>
    {
        if ( req.session.role === 'admin' )
            return next();
        else return res.redirect( '/' );
    },
    non_reader_authorization: ( req, res, next ) =>
    {
        if ( req.session.role === 'undefined' || req.session.role === 'reader' )
            return res.redirect( '/' );
        else return next();
    }
};