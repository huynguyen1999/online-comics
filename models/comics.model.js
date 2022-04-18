const database = require( '../utils/database' );
const moment = require( 'moment' );
require( 'dotenv' ).config();

module.exports = {
    top_views: _ =>
    {
        const sql =
            `SELECT t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter,
                UNIX_TIMESTAMP(CURTIME()) - UNIX_TIMESTAMP(t2.ch_Update) as c_LastUpdate
            FROM 
                    (SELECT cm.c_ID, cm.c_Name, SUM(vw.v_Views) AS c_Views
                    FROM comics cm LEFT JOIN views vw ON cm.c_ID = vw.c_ID
                    GROUP BY cm.c_ID, cm.c_Name) AS t1
                LEFT JOIN 
                    (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                    FROM comics cm
                    INNER JOIN chapters ch 
                    USING (c_ID)
                    GROUP BY cm.c_ID) AS t2
                USING (c_ID)
            GROUP BY t1.c_ID, t1.c_Name, t2.c_LatestChapter, t2.ch_Update, t1.c_Views
            ORDER BY t1.c_Views DESC
            LIMIT 6;`;
        return database.load( sql );
    },
    new_updates: ( offset ) =>
    {
        const sql =
            `SELECT t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter,
                UNIX_TIMESTAMP ( CURTIME()) - UNIX_TIMESTAMP( t2.ch_Update ) as c_LastUpdate
            FROM
                ( SELECT cm.c_ID, cm.c_Name, SUM( vw.v_Views ) AS c_Views
                FROM comics cm LEFT JOIN views vw ON cm.c_ID = vw.c_ID
                GROUP BY cm.c_ID, cm.c_Name ) AS t1
            LEFT JOIN
                (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                FROM comics cm
                INNER JOIN chapters ch 
                USING (c_ID)
                GROUP BY cm.c_ID) AS t2
            USING( c_ID )
            GROUP BY t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, t2.ch_Update
            ORDER BY c_LastUpdate ASC
            LIMIT ${ process.env.PAGINATION_LIMIT }
            OFFSET ${ offset }; `;
        return database.load( sql );
    },
    new_uploads: ( offset ) =>
    {
        const sql =
            `SELECT t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, t1.c_UploadDate,
                UNIX_TIMESTAMP ( CURTIME()) - UNIX_TIMESTAMP( t2.ch_Update ) as c_LastUpdate
            FROM
                (SELECT cm.c_ID, cm.c_Name, SUM( vw.v_Views ) AS c_Views, cm.c_UploadDate
                FROM comics cm LEFT JOIN views vw ON cm.c_ID = vw.c_ID
                GROUP BY cm.c_ID, cm.c_Name, cm.c_UploadDate  ) AS t1
            LEFT JOIN
                (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                FROM comics cm
                INNER JOIN chapters ch 
                USING (c_ID)
                GROUP BY cm.c_ID) AS t2
            USING( c_ID )
            GROUP BY t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, t2.ch_Update
            ORDER BY t1.c_UploadDate DESC
            LIMIT ${ process.env.PAGINATION_LIMIT }
            OFFSET ${ offset }; `;
        return database.load( sql );
    },
    top_day: ( offset ) =>
    {
        const sql =
            `SELECT t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter,
                UNIX_TIMESTAMP ( CURTIME()) - UNIX_TIMESTAMP( t2.ch_Update ) as c_LastUpdate
            FROM
                (SELECT cm.c_ID, cm.c_Name, SUM( vw.v_Views ) AS c_Views
                FROM comics cm LEFT JOIN views vw ON cm.c_ID = vw.c_ID
                AND DATEDIFF(CURDATE(), vw.v_Date) < 1
                GROUP BY cm.c_ID, cm.c_Name  ) AS t1
            LEFT JOIN
                (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                FROM comics cm
                INNER JOIN chapters ch 
                USING (c_ID)
                GROUP BY cm.c_ID) AS t2
            USING( c_ID )
            GROUP BY t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, t2.ch_Update
            ORDER BY t1.c_Views DESC
            LIMIT ${ process.env.PAGINATION_LIMIT }
            OFFSET ${ offset }; `;
        return database.load( sql );
    },
    top_week: ( offset ) =>
    {
        const sql =
            `SELECT t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter,
                UNIX_TIMESTAMP ( CURTIME()) - UNIX_TIMESTAMP( t2.ch_Update ) as c_LastUpdate
            FROM
                (SELECT cm.c_ID, cm.c_Name, SUM( vw.v_Views ) AS c_Views
                FROM comics cm LEFT JOIN views vw ON cm.c_ID = vw.c_ID
                AND DATEDIFF(CURDATE(), vw.v_Date) < 7
                GROUP BY cm.c_ID, cm.c_Name  ) AS t1
            LEFT JOIN
                (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                FROM comics cm
                INNER JOIN chapters ch 
                USING (c_ID)
                GROUP BY cm.c_ID) AS t2
            USING( c_ID )
            GROUP BY t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, t2.ch_Update
            ORDER BY t1.c_Views DESC
            LIMIT ${ process.env.PAGINATION_LIMIT }
            OFFSET ${ offset }; `;
        return database.load( sql );
    },
    top_month: ( offset ) =>
    {
        const sql =
            `SELECT t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter,
                UNIX_TIMESTAMP ( CURTIME()) - UNIX_TIMESTAMP( t2.ch_Update ) as c_LastUpdate
            FROM
                (SELECT cm.c_ID, cm.c_Name, SUM( vw.v_Views ) AS c_Views
                FROM comics cm LEFT JOIN views vw ON cm.c_ID = vw.c_ID 
                AND DATEDIFF(CURDATE(), vw.v_Date) < 30
                GROUP BY cm.c_ID, cm.c_Name  ) AS t1
            LEFT JOIN
                (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                FROM comics cm
                INNER JOIN chapters ch 
                USING (c_ID)
                GROUP BY cm.c_ID) AS t2
            USING( c_ID )
            GROUP BY t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, t2.ch_Update
            ORDER BY t1.c_Views DESC
            LIMIT ${ process.env.PAGINATION_LIMIT }
            OFFSET ${ offset }; `;
        return database.load( sql );
    },
    top_likes: ( offset ) =>
    {
        const sql =
            `SELECT t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, t1.c_Likes,
                UNIX_TIMESTAMP ( CURTIME()) - UNIX_TIMESTAMP( t2.ch_Update ) as c_LastUpdate
            FROM
                (SELECT cm.c_ID, cm.c_Name, SUM( vw.v_Views ) AS c_Views, cm.c_Likes
                FROM comics cm LEFT JOIN views vw ON cm.c_ID = vw.c_ID 
                GROUP BY cm.c_ID, cm.c_Name, cm.c_Likes  ) AS t1
            LEFT JOIN
                (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                FROM comics cm
                INNER JOIN chapters ch 
                USING (c_ID)
                GROUP BY cm.c_ID) AS t2
            USING( c_ID )
            GROUP BY t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, t2.ch_Update
            ORDER BY t1.c_Likes DESC
            LIMIT ${ process.env.PAGINATION_LIMIT }
            OFFSET ${ offset }; `;
        return database.load( sql );
    },
    top_follows: ( offset ) =>
    {
        const sql =
            `SELECT t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, t1.c_Follows,
                UNIX_TIMESTAMP ( CURTIME()) - UNIX_TIMESTAMP( t2.ch_Update ) as c_LastUpdate
            FROM
                (SELECT cm.c_ID, cm.c_Name, SUM( vw.v_Views ) AS c_Views, cm.c_Follows
                FROM comics cm LEFT JOIN views vw ON cm.c_ID = vw.c_ID 
                GROUP BY cm.c_ID, cm.c_Name, cm.c_Follows  ) AS t1
            LEFT JOIN
                (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                FROM comics cm
                INNER JOIN chapters ch 
                USING (c_ID)
                GROUP BY cm.c_ID) AS t2
            USING( c_ID )
            GROUP BY t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, t2.ch_Update
            ORDER BY t1.c_Follows DESC
            LIMIT ${ process.env.PAGINATION_LIMIT }
            OFFSET ${ offset }; `;
        return database.load( sql );
    },
    n_comics: async _ =>
    {
        const sql = `SELECT COUNT( c_ID ) as num_comics FROM comics`;
        const rows = await database.load( sql );
        return rows[ 0 ].num_comics;
    },
    single: async comic_id =>
    {
        const sql =
            `SELECT (SELECT SUM(v_Views) FROM views WHERE views.c_ID = cm.c_ID GROUP BY c_ID)
                as c_Views, cm.*, au.a_Name
            FROM comics cm 
                LEFT JOIN comic_tag_details cmtd USING (c_ID)
                LEFT JOIN tags t USING (t_ID)
                LEFT JOIN authors au USING (a_ID)
            WHERE cm.c_ID = ${ comic_id }
            GROUP BY cm.c_ID`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return null;
        return rows[ 0 ];
    },
    view_by_date: async ( v_Date, c_ID ) =>
    {
        const sql = `SELECT * FROM views WHERE v_Date = "${ v_Date }" and c_ID = ${ c_ID }`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return null;
        return rows[ 0 ];
    },
    increase_view: async ( comic_id, view_date ) =>
    {
        if ( view_date === null ) //add
            return await database.add( {
                v_Date: moment( new Date() ).format( 'YYYY-MM-DD' ),
                c_ID: comic_id,
                v_Views: 1
            }, 'views' );
        else return await database.load( `UPDATE views SET v_Views = v_Views + 1 
            WHERE c_ID =${ comic_id } AND v_Date="${ moment( new Date() ).format( 'YYYY-MM-DD' ) }"` );
    },
    all_chapters: comic_id =>
    {
        const sql =
            `SELECT *
            FROM chapters 
            WHERE c_ID = ${ comic_id }
            ORDER BY ch_No DESC`;
        return database.load( sql );
    },
    get_chapter: async chapter_id =>
    {
        const sql = `SELECT ch_No, ch_ID FROM chapters WHERE ch_ID = ${ chapter_id }`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return null;
        return rows[ 0 ];
    },
    get_latest_chapter: async comic_id =>
    {
        const sql = `select MAX(ch_No) as latest_chapter from chapters where c_ID = ${ comic_id }`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return 1;
        return rows[0].latest_chapter;
    },
    get_comments_of_comic: ( comic_id ) =>
    {
        const sql =
            `SELECT comments.*, ch_No, c_ID, u_Name
            FROM comments JOIN chapters USING (ch_ID)
            JOIN users USING (u_ID)
            WHERE c_ID = ${ comic_id }
            ORDER BY cmt_Time DESC`;
        return database.load( sql );
    },
    search: async key =>
    {
        const sql = `SELECT c_ID, c_Name
                    FROM comic_suffixes LEFT JOIN comics USING(c_ID)
                    WHERE cs_Suffix like "${ key }%"
                    GROUP BY c_ID`;
        return database.load( sql );
    },

};;