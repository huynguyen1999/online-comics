const { engine } = require( 'express-handlebars' );
const hbs_sections = require( 'express-handlebars-sections' );

module.exports = function ( app )
{
    app.engine( 'hbs', engine( {
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        helpers: {
            section: hbs_sections(),
            ifeq: ( a, b, options ) => { if ( a == b ) return options.fn( this ); return options.inverse( this ); },
            ifnoteq: ( a, b, options ) => { if ( a != b ) return options.fn( this ); return options.inverse( this ); },
            ifbigger: ( a, b, options ) => { if ( a > b ) return options.fn( this ); return options.inverse( this ); },
            ifse: ( a, b, options ) => { if ( a <= b ) return options.fn( this ); return options.inverse( this ); },
            sub: ( a ) => +a - 1,
            add: ( a ) => +a + 1,
        }
    } ) );
    app.set( 'view engine', 'hbs' );
};