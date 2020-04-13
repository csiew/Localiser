import auth from './auth.js';
import Pool from 'pg';

console.log("AUTH: ", auth.DATABASE);
const pool = new Pool.Pool({
    user: `${auth.USERNAME}`,
    host: `${auth.HOST}`,
    database: `${auth.DATABASE}`,
    password: `${auth.PASSWORD}`,
    port: auth.PORT,
});

console.log("User: ", pool.options.user);

const getUsers = (request, response) => {
    pool.query('SELECT * FROM user_account ORDER BY username ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const db = {
    getUsers,
};

export default db;