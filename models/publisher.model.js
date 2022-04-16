const database = require( '../utils/database' );
const moment = require( 'moment' );
require( 'dotenv' ).config();

module.exports = {
    add_suffixes: async ( comic_id, comic_name ) =>
    {
        for ( let i = 0; i < comic_name.length; i += 1 )
        {
            let suffix = comic_name.substr( i );
            await database.add( { c_ID: comic_id, cs_Suffix: suffix }, 'comic_suffixes' );
        }
    },
    remove_suffixes: ( comic_id ) =>
    {
        database.del( { c_ID: comic_id }, 'comic_suffixes' );
    },
    edit_name: ( entity ) =>
    {
        const condition = { c_ID: entity.c_ID };
        delete entity[ 'c_ID' ];
        return database.patch( entity, condition, 'comics' );
    },

};