const multer = require( 'multer' );
const comics_model = require( '../models/comics.model' );
const publisher_model = require( '../models/publisher.model' );
const moment = require( 'moment' );
const fs = require( "fs" );

const storage = multer.diskStorage( {
    destination: async function ( req, file, cb )
    {
        if ( req.body.new_chapter_id === undefined )
        {
            const new_chapter = await publisher_model.add_chapter( {
                ch_No: 0,
                ch_Update: moment( new Date() ).format( 'YYYY-MM-DD HH:mm:ss' ),
                c_ID: 0
            } );
            req.body.new_chapter_id = new_chapter.insertId;
        }
        console.log( req.body.new_chapter_id );
        const user_upload_path = `./public/uploads/${ req.user.u_ID }/chapters/${ req.body.new_chapter_id }`;
        const path_existed = await fs.existsSync( user_upload_path );
        if ( !path_existed )
            await fs.promises.mkdir( user_upload_path, { recursive: true } );

        req.body.user_upload_path = user_upload_path;
        cb( null, user_upload_path );
    },
    filename: function ( req, file, cb )
    {
        cb( null, file.originalname );
    }
} );
const upload = multer( { storage } );
module.exports = upload;