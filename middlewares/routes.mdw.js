module.exports = app =>
{
    app.use( '/', require( '../routes/index.routes' ) );
    app.use( '/comic/', require( '../routes/comic.routes' ) );
    app.use( '/tags/', require( '../routes/tags.routes' ) );
    app.use( '/account/', require( '../routes/account.routes' ) );
    app.use( '/ranking/', require( '../routes/ranking.routes' ) );
    app.use( '/admin/', require( '../routes/admin.routes' ) );
    app.use( '/publisher/', require( '../routes/publisher.routes' ) );
    app.use( '/authors/', require( '../routes/authors.routes' ) );
};