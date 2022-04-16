const database = require( '../utils/database' );
const moment = require( 'moment' );
require( 'dotenv' ).config();

module.exports = {
    get_users: () =>
    {
        const sql = `SELECT * 
                    FROM users 
                    WHERE u_IsAdmin = 0`;
        return database.load( sql );
    },
    get_tags: () =>
    {
        const sql = `SELECT * FROM tags`;
        return database.load( sql );
    },
    get_pending_requests: () =>
    {
        const sql = `SELECT * 
                    FROM publisher_requests
                    JOIN users USING(u_ID)
                    WHERE users.u_IsPublisher = 0`;
        return database.load( sql );
    },
    ban_user: async user_id =>
    {
        const tomorrow = new Date();
        tomorrow.setDate( tomorrow.getDate() + 1 );
        const mysql_tomorrow = moment( tomorrow ).format( 'YYYY-MM-DD HH:mm:ss' );
        const ban_entity = {
            u_IsBanned: 1,
            u_BanExp: mysql_tomorrow
        };
        await database.patch( ban_entity, { u_ID: user_id }, 'users' );
        const unban_event_sql =
            `CREATE EVENT IF NOT EXISTS auto_unban${ user_id } 
            ON SCHEDULE AT '${ mysql_tomorrow }' 
            DO UPDATE users SET u_IsBanned = 0 WHERE u_ID = ${ user_id };`;
        await database.load( unban_event_sql );
    },
    unban_user: async user_id =>
    {
        const unban_entity = {
            u_IsBanned: 0,
            u_BanExp: null
        };
        await database.patch( unban_entity, { u_ID: user_id }, 'users' );
        const remove_unban_event_sql = `DROP EVENT IF EXISTS auto_unban${ user_id }`;
        await database.load( remove_unban_event_sql );
    },
    demote_user: user_id => database.patch( { u_IsPublisher: 0 }, { u_ID: user_id }, 'users' ),
    promote_user: user_id => database.patch( { u_IsPublisher: 1 }, { u_ID: user_id }, 'users' ),
    remove_user: async user_id =>
    {
        await database.del( { u_ID: user_id }, 'likes' );
        await database.del( { u_ID: user_id }, 'follows' );
        await database.del( { u_ID: user_id }, 'publisher_requests' );
        await database.del( { u_ID: user_id }, 'history' );
        await database.del( { u_ID: user_id }, 'comments' );
        await database.del( { u_ID: user_id }, 'users' );
    },
    accept_request: user_id =>
        database.add( {
            u_ID: user_id,
            pr_Time: moment( new Date() ).format( 'YYYY-MM-DD HH:mm:ss' )
        }, 'publisher_requests' ),
    reject_request: user_id => database.del( { u_ID: user_id }, 'publisher_requests' )

};