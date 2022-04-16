const database = require( '../utils/database' );
require( 'dotenv' ).config();

module.exports = {

    all_tags: _ =>
    {
        const sql = `SELECT * FROM tags`;
        return database.load( sql );
    },
    get_tags_of_comic: ( comic_id ) =>
    {
        const sql = `SELECT t_Name, t_ID
                    FROM  comics LEFT JOIN comic_tag_details USING(c_ID)
                    LEFT JOIN tags USING(t_ID)
                    WHERE comic_tag_details.c_ID = ${ comic_id }`;
        return database.load( sql );
    },
    get_comics_of_tag: ( tag_id, status, sort, offset ) =>
    {
        const sort_dict = {
            0: 'c_LastUpdate ASC', 1: 'c_LastUpdate DESC',
            2: 'cm.c_UploadDate DESC', 3: 'cm.c_UploadDate ASC',
            4: 'c_Views DESC', 5: 'c_Views ASC'
        };
        if ( status == 0 ) status = 'cm.c_Status';
        const sql =
            `SELECT cm.*, SUM(vw.v_Views) as c_Views, t1.c_LatestChapter, 
                UNIX_TIMESTAMP ( CURTIME()) - UNIX_TIMESTAMP( t1.ch_Update ) as c_LastUpdate
            FROM tags t 
                JOIN comic_tag_details cmtd USING (t_ID) 
                JOIN comics cm USING (c_ID)
                JOIN views vw USING (c_ID)
                JOIN (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                    FROM comics cm
                    INNER JOIN chapters ch 
                    USING (c_ID)
                    GROUP BY cm.c_ID) as t1 
                USING (c_ID)
            WHERE t.t_ID = ${ tag_id } and cm.c_Status = ${ status }
            GROUP BY cm.c_ID, t1.c_LatestChapter, t1.ch_Update
            ORDER BY ${ sort_dict[ sort ] }
            LIMIT ${ process.env.PAGINATION_LIMIT }
            OFFSET ${ offset }`;
        return database.load( sql );
    },
    get_tag: async tag_id =>
    {
        const sql = `SELECT * FROM tags WHERE t_ID = ${ tag_id }`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return null;
        return rows[ 0 ];
    },
    remove_tag: tag_id => database.del( { t_ID: tag_id }, 'tags' ),
    add_tag: tag_entity => database.add( tag_entity, 'tags' ),
    update_tag: tag_entity =>
    {
        const condition = { t_ID: tag_entity.t_ID };

        delete tag_entity[ 't_ID' ];
        return database.patch( tag_entity, condition, 'tags' );
    }
};