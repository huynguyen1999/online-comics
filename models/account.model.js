const database = require( '../utils/database' );
require( 'dotenv' ).config();

module.exports = {
    find_by_username: async username =>
    {
        const sql = `SELECT * FROM users WHERE u_Username = "${ username }"`;
        const rows = await database.load( sql );
        if ( !rows.length ) return null;
        return rows[ 0 ];
    },
    find_by_email: async email =>
    {
        const sql = `SELECT * FROM users WHERE u_Email = "${ email }"`;
        const rows = await database.load( sql );
        if ( !rows.length ) return null;
        return rows[ 0 ];
    },
    find_by_id: async id =>
    {
        const sql = `SELECT * FROM users WHERE u_ID = ${ id }`;
        const rows = await database.load( sql );
        if ( !rows.length ) return null;
        return rows[ 0 ];
    },
    add: user_entity => database.add( user_entity, 'users' ),
    update_profile: ( user_entity ) =>
    {
        const condition = user_entity.u_ID;
        delete user_entity[ 'u_ID' ];
        return database.patch( user_entity, condition, `users` );
    },
    update_password: ( password_entity ) =>
    {
        console.log( password_entity );
        const condition = password_entity.u_ID;
        delete password_entity[ 'u_ID' ];
        return database.patch( password_entity, condition, 'users' );
    },
    get_password: async user_id =>
    {
        const sql = `SELECT u_Password FROM users WHERE u_ID = ${ user_id }`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return null;
        return rows[ 0 ].u_Password;
    },
    check_like: async ( user_id, comic_id ) =>
    {
        const sql = `SELECT * FROM likes WHERE u_ID = ${ user_id } and c_ID = ${ comic_id }`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return false;
        return true;
    },
    check_follow: async ( user_id, comic_id ) =>
    {
        const sql = `SELECT * FROM follows WHERE u_ID = ${ user_id } and c_ID = ${ comic_id }`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return false;
        return true;
    },
    like: async ( like_entity ) =>
    {
        // user like
        await database.add( like_entity, 'likes' );
        // comic like increase
        const current_likes = await database.load( `SELECT c_Likes FROM comics WHERE c_ID = ${ like_entity.c_ID }` );
        await database.patch( { c_Likes: current_likes[ 0 ].c_Likes + 1 },
            { c_ID: like_entity.c_ID },
            'comics' );
    },
    dislike: async ( dislike_entity ) =>
    {
        const user_dislike = `DELETE FROM likes WHERE c_ID = ${ dislike_entity.c_ID } and u_ID = ${ dislike_entity.u_ID }`;
        await database.load( user_dislike );
        // comic dislike decrease
        const current_likes = await database.load( `SELECT c_Likes FROM comics WHERE c_ID = ${ dislike_entity.c_ID }` );
        await database.patch( { c_Likes: current_likes[ 0 ].c_Likes - 1 },
            { c_ID: dislike_entity.c_ID },
            'comics' );
    },
    comment: ( comment_entity ) => database.add( comment_entity, 'comments' ),
    uncomment: ( comment_id ) => database.del( comment_id, 'comments' ),
    edit_comment: ( comment_entity ) =>
    {
        const condition = { cmt_ID: comment_entity.cmt_ID };
        delete comment_entity[ 'cmt_ID' ];
        return database.patch( comment_entity, condition, 'comments' );
    },
    follow: async ( follow_entity ) =>
    {
        await database.add( follow_entity, 'follows' );
        // comic follow increase
        const current_follows = await database.load( `SELECT c_Follows FROM comics WHERE c_ID = ${ follow_entity.c_ID }` );
        console.log( current_follows );
        await database.patch( { c_Follows: current_follows[ 0 ].c_Follows + 1 },
            { c_ID: follow_entity.c_ID },
            'comics' );
    },
    unfollow: async ( unfollow_entity ) =>
    {
        const user_unfollow = `DELETE FROM follows WHERE c_ID = ${ unfollow_entity.c_ID } and u_ID = ${ unfollow_entity.u_ID }`;
        await database.load( user_unfollow );
        // comic follow decrease
        const current_follows = await database.load( `SELECT c_Follows FROM comics WHERE c_ID = ${ unfollow_entity.c_ID }` );
        await database.patch( { c_Follows: current_follows[ 0 ].c_Follows - 1 },
            { c_ID: unfollow_entity.c_ID },
            'comics' );
    },
    n_likes: async ( user_id ) =>
    {
        const sql = `select COUNT(*) as n_likes from likes where u_ID = ${ user_id } group by u_ID`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return 0;
        return rows[ 0 ].n_likes;
    },
    likes: ( user_id, offset ) =>
    {
        const sql = `SELECT t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, likes.l_ID, t1.c_Views,
                        UNIX_TIMESTAMP(CURTIME()) - UNIX_TIMESTAMP(t2.ch_Update) as c_LastUpdate
                    FROM likes LEFT JOIN
                            (SELECT cm.c_ID, cm.c_Name, SUM(vw.v_Views) AS c_Views
                            FROM comics cm LEFT JOIN views vw ON cm.c_ID = vw.c_ID
                            GROUP BY cm.c_ID, cm.c_Name) AS t1
                        USING (c_ID)
                        LEFT JOIN 
                            (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                            FROM comics cm
                            INNER JOIN chapters ch 
                            USING (c_ID)
                            GROUP BY cm.c_ID) AS t2
                        USING (c_ID)
                    WHERE u_ID = ${ user_id }
                    GROUP BY t1.c_ID, t1.c_Name, t2.c_LatestChapter, t2.ch_Update, t1.c_Views, likes.l_ID
                    ORDER BY likes.l_ID DESC
                    LIMIT ${ process.env.PAGINATION_LIMIT }
                    OFFSET ${ offset }`;
        return database.load( sql );
    },
    n_follows: async user_id =>
    {
        const sql = `select COUNT(*) as n_follows from follows where u_ID = ${ user_id } group by u_ID`;
        const rows = await database.load( sql );
        if ( rows.length === 0 ) return 0;
        return rows[ 0 ].n_follows;
    },
    follows: ( user_id, offset ) =>
    {
        const sql = `SELECT t1.c_ID, t1.c_Name, t1.c_Views, t2.c_LatestChapter, follows.f_ID, t1.c_Views,
                        UNIX_TIMESTAMP(CURTIME()) - UNIX_TIMESTAMP(t2.ch_Update) as c_LastUpdate
                    FROM follows LEFT JOIN
                            (SELECT cm.c_ID, cm.c_Name, SUM(vw.v_Views) AS c_Views
                            FROM comics cm LEFT JOIN views vw ON cm.c_ID = vw.c_ID
                            GROUP BY cm.c_ID, cm.c_Name) AS t1
                        USING (c_ID)
                        LEFT JOIN 
                            (SELECT  cm.c_ID, max(ch.ch_No) as c_LatestChapter, max(ch.ch_Update) as ch_Update
                            FROM comics cm
                            INNER JOIN chapters ch 
                            USING (c_ID)
                            GROUP BY cm.c_ID) AS t2
                        USING (c_ID)
                    WHERE u_ID = ${ user_id }
                    GROUP BY t1.c_ID, t1.c_Name, t2.c_LatestChapter, t2.ch_Update, t1.c_Views, follows.f_ID
                    ORDER BY follows.f_ID DESC
                    LIMIT ${ process.env.PAGINATION_LIMIT }
                    OFFSET ${ offset }`;
        return database.load( sql );
    },
    make_history: history_entity => database.add( history_entity, 'history' ),
    history: user_id =>
    {
        const sql = `SELECT history.*, comics.c_Name, chapters.ch_No
                    FROM history LEFT JOIN comics USING (c_ID)
                    LEFT JOIN chapters USING (ch_ID)
                    WHERE u_ID = ${ user_id }
                    ORDER BY history.h_Time DESC`;
        return database.load( sql );
    },
    delete_history: history_id => database.del( { h_ID: history_id }, 'history' ),
    empty_history: user_id => database.del( { u_ID: user_id }, 'history' ),
    request_publisher: request_entity => database.add( request_entity, 'publisher_requests' )
};