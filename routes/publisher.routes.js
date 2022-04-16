const express = require( 'express' );
const router = express.Router();
const account_model = require( '../models/account.model' );
const account_auth = require( '../middlewares/account_auth.mdw' );
const { publisher_authorization, non_reader_authorization } = require( '../middlewares/account_authorization.mdw' );
const moment = require( 'moment' );
const publisher_model = require( '../models/publisher.model' );
const passport = require( '../config/passport.config' );

router.post( '/edit-name', non_reader_authorization, async ( req, res ) =>
{
    try
    {
        const { comic_id, comic_name } = req.body;
        const entity = { c_ID: req.body.comic_id, c_Name: req.body.comic_name };
        await Promise.all(
            [ publisher_model.edit_name( entity ),
            publisher_model.remove_suffixes( comic_id ) ] );
        await publisher_model.add_suffixes( comic_id, comic_name );
        res.json( true );
    }
    catch ( error )
    {
        console.log( error );
        res.json( false );
    }
} );


module.exports = router;