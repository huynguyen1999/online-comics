const account_model = require( '../models/account.model' );
const LocalStrategy = require( 'passport-local' ).Strategy;
const bcrypt = require( 'bcryptjs' );
const passport = require( 'passport' );

passport.serializeUser( ( user, done ) => done( null, user.u_ID )
);

passport.deserializeUser( async ( id, done ) =>//obj consists of id and type;
{
    try
    {
        const user = await account_model.find_by_id( id );
        return done( null, user );
    }
    catch ( error ) { console.log( error ); }
} );

passport.use( 'user', new LocalStrategy(
    async ( username, password, done ) =>
    {
        try
        {
            const user = await account_model.find_by_username( username );
            const similar = await bcrypt.compare( password, user.u_Password );
            if ( user.u_IsBanned )
                return done( null, false, { message: 'Account has been locked!' } );
            if ( !similar )
                return done( null, false, { message: 'Incorrect password!' } );
            return done( null, user );
        }
        catch ( error ) { return done( error ); }
    }
) );

module.exports = passport;