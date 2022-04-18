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
    get_publisher_comics: async user_id =>
    {
        const sql = `select * 
                    from publisher_comics left join comics using(c_ID)
                    left join (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                                    FROM comics cm
                                    INNER JOIN chapters ch 
                                    USING (c_ID)
                                    GROUP BY cm.c_ID) AS t1
                    USING( c_ID )
                    where u_ID = ${ user_id }`;
        return database.load( sql );
    },
    add_comic: async ( entity, user_id ) =>
    {
        const info = await database.add( entity, 'comics' );
        await database.add( { c_ID: info.insertId, u_ID: user_id }, `publisher_comics` );
        return info;
    },
    update_comic: async ( entity ) =>
    {
        const condition = { c_ID: entity.c_ID };
        delete entity[ 'c_ID' ];
        return database.patch( entity, condition, 'comics' );
    },
    add_chapter: async ( entity ) => database.add( entity, 'chapters' ),
    update_chapter: async ( entity ) =>
    {
        const condition = { ch_ID: entity.ch_ID };
        delete entity[ 'ch_ID' ];
        return database.patch( entity, condition, 'chapters' );
    },
};