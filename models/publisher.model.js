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
    edit_status: entity =>
    {
        const condition = { c_ID: entity.c_ID };
        delete entity[ 'c_ID' ];
        return database.patch( entity, condition, 'comics' );
    },
    edit_likes: entity =>
    {
        const condition = { c_ID: entity.c_ID };
        delete entity[ 'c_ID' ];
        return database.patch( entity, condition, 'comics' );
    },
    edit_follows: entity =>
    {
        const condition = { c_ID: entity.c_ID };
        delete entity[ 'c_ID' ];
        return database.patch( entity, condition, 'comics' );
    },
    add_tag: entity => database.add( entity, 'comic_tag_details' ),
    remove_tag: ( tag_id, comic_id ) =>
    {
        const sql = `delete from comic_tag_details where t_ID=${ tag_id } and c_ID=${ comic_id }`;
        return database.load( sql );
    },
    remove_chapter: ( chapter_id ) => database.del( { ch_ID: chapter_id }, 'chapters' ),
    remove_comic: async ( user_id, comic_id ) =>
    {
        const remove_publisher_comic = `delete from publisher_comics where c_ID = ${ comic_id } and u_ID = ${ user_id }`;
        await Promise.all(
            [ database.del( { c_ID: comic_id }, 'comics' ),
            database.del( { c_ID: comic_id }, 'chapters' ),
            database.load( remove_publisher_comic ) ] );
    },
    is_editible: async ( user_id, comic_id ) =>
    {
        const sql = `select * from publisher_comics where u_ID = ${ user_id } and c_ID = ${ comic_id }`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return false;
        return true;
    },
    edit_description: async ( entity ) =>
    {
        const condition = { c_ID: entity.c_ID };
        delete entity[ 'c_ID' ];
        return database.patch( entity, condition, 'comics' );
    },
    
};