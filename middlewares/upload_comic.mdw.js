const multer = require( 'multer' );
const comics_model = require( '../models/comics.model' );
const publisher_model = require( '../models/publisher.model' );
const moment = require( 'moment' );
const fs = require( "fs" );
const storage = multer.diskStorage( {
    destination: async function ( req, file, cb )
    {
        const new_comic = await publisher_model.add_comic( {
            c_Name: '',
            c_Status: 1,
            c_UploadDate: moment( new Date() ).format( 'YYYY-MM-DD' ),
            c_Likes: 0,
            c_Follows: 0,
            c_Description: '',
            a_ID: 0
        }, req.user.u_ID );

        const user_upload_path = `./public/uploads/${ req.user.u_ID }/comics/${ new_comic.insertId }`;
        const path_existed = await fs.existsSync( user_upload_path );
        if ( !path_existed )
            await fs.promises.mkdir( user_upload_path, { recursive: true } );

        req.body.user_upload_path = user_upload_path;
        req.body.new_comic_id = new_comic.insertId;
        cb( null, user_upload_path );
    },
    filename: function ( req, file, cb )
    {
        cb( null, file.fieldname + '.jpg' );
    }
} );
const upload = multer( { storage } );
module.exports = upload;