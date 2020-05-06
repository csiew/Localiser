import dbAuth from './auth/db_auth.js';
import dbCore from './auth/db_core.js';
import Pool from 'pg';

// Authentication database
const AuthPool = new Pool.Pool({
    user: `${dbAuth.USERNAME}`,
    host: `${dbAuth.HOST}`,
    database: `${dbAuth.DATABASE}`,
    password: `${dbAuth.PASSWORD}`,
    port: dbAuth.PORT,
});

// Metadata database
const CorePool = new Pool.Pool({
    user: `${dbCore.USERNAME}`,
    host: `${dbCore.HOST}`,
    database: `${dbCore.DATABASE}`,
    password: `${dbCore.PASSWORD}`,
    port: dbCore.PORT,
});

const db_pool = {
    AuthPool,
    CorePool,
};

export default db_pool;