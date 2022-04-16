const database = require( '../utils/database' );
const moment = require( 'moment' );
require( 'dotenv' ).config();

module.exports = {
    get_comics_of_author: ( author_id ) =>
    {
        const sql =
            `SELECT t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter,
                UNIX_TIMESTAMP ( CURTIME()) - UNIX_TIMESTAMP( t2.ch_Update ) as c_LastUpdate
            FROM
                (SELECT cm.c_ID, cm.c_Name, SUM( vw.v_Views ) AS c_Views, cm.a_ID
                FROM comics cm LEFT JOIN views vw ON cm.c_ID = vw.c_ID
                GROUP BY cm.c_ID, cm.c_Name, cm.a_ID  ) AS t1
            LEFT JOIN
                (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                FROM comics cm
                INNER JOIN chapters ch 
                USING (c_ID)
                GROUP BY cm.c_ID) AS t2
            USING( c_ID )
            WHERE t1.a_ID = ${ author_id }
            GROUP BY t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, t2.ch_Update
            ORDER BY t1.c_Views DESC`;
        return database.load( sql );
    },
    get_author: async author_id =>
    {
        const sql = `SELECT * FROM authors WHERE a_ID = ${ author_id }`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return null;
        return rows[ 0 ];
    }
};