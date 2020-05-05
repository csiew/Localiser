import dbAuth from './auth/db_auth.js';
import dbCore from './auth/db_core.js';
import Pool from 'pg';
import { v4 as uuidv4 } from 'uuid';

const AuthPool = new Pool.Pool({
    user: `${dbAuth.USERNAME}`,
    host: `${dbAuth.HOST}`,
    database: `${dbAuth.DATABASE}`,
    password: `${dbAuth.PASSWORD}`,
    port: dbAuth.PORT,
});
const CorePool = new Pool.Pool({
    user: `${dbCore.USERNAME}`,
    host: `${dbCore.HOST}`,
    database: `${dbCore.DATABASE}`,
    password: `${dbCore.PASSWORD}`,
    port: dbCore.PORT,
});

const getUsers = (request, response) => {
    CorePool.query('SELECT * FROM user_account ORDER BY username ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const createUser = (request, response) => {
    const { email, given_name, family_name } = request.body;
    const id = uuidv4();

    AuthPool.query(`INSERT INTO account (id, role_id, email, password) VALUES ('${id}', 'STANDARD', '${email}', 'password')`, (error, result) => {
        if (error) {
            response.status(500).send(`Unable to create user auth for ${email}`);
            throw error;
        }
        console.log(`Created user auth for ${email} with ID: ${id}`);

        // Only create user profile if account was created.
        CorePool.query(`INSERT INTO user_account (id, email, given_name, family_name) VALUES ('${id}', '${email}', '${given_name}', '${family_name}')`, (error, result) => {
            if (error) {
                response.status(500).send(`Unable to create user profile for ${email}`);
                throw error;
            }
            response.status(201).send(`User profile created for: ${email}`);
        });
    });
};

const db = {
    getUsers,
    createUser,
};

export default db;