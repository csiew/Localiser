import db_pool from './dbPool.js';
import { v4 as uuidv4 } from 'uuid';

// saveUserProfileToLocal
// type: GET
const saveUserProfileToLocal = (request, response, next) => {
    const { userId } = request.session;
    if (userId) {
        db_pool.CorePool.query(`SELECT * FROM user_account WHERE id='${userId}'`, (error, results) => {
            if (error) {
                console.log(error);
                console.log('No such ID exists');
            } else {
                if (results.rows.length == 1) {
                    const user = results.rows[0];
                    console.log('User profile found:');
                    console.log(user);
                    response.locals.user = user;
                }
            }
            next();
        });
    }
};

// getUsers
// type: GET
const getUsers = (request, response) => {
    db_pool.CorePool.query('SELECT * FROM user_account ORDER BY username ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

// createUser
// type: POST
const createUser = (request, response) => {
    const { email, givenName, familyName, password } = request.body;
    const id = uuidv4();

    // TODO: Validation + prevent SQL injection

    // Check for existing user with same email
    db_pool.AuthPool.query(`SELECT * FROM account WHERE email='${email}'`, (error, results) => {
        if (error || results.rows.length == 1) {
            console.log('Account with same email already exists');
            return response.redirect('/signup');
        }
    });

    // Create authentication profile.
    db_pool.AuthPool.query(`INSERT INTO account (id, role_id, email, password) VALUES ('${id}', 'STANDARD', '${email}', '${password}')`, (error, result) => {
        if (error) {
            return response.redirect('/signup');
        }
        console.log(result.rows[0]);
        console.log(`Created user auth for ${email} with ID: ${id}`);

        // Only create user profile if authentication account was created.
        db_pool.CorePool.query(`INSERT INTO user_account (id, email, given_name, family_name) VALUES ('${id}', '${email}', '${givenName}', '${familyName}')`, (error, result) => {
            if (error) {
                return response.redirect('/signup');
            }
            console.log(result.rows[0]);

            // Ensure account has been created, then login the user.
            db_pool.AuthPool.query(`SELECT * FROM account WHERE email='${email}'`, (error, results) => {
                if (error) {
                    return response.redirect('/signup');
                }
                request.session.userId = results.rows[0].id;
                return response.redirect('/login');
            });
        });
    });
};

// login
// type: POST
const login = (request, response) => {
    const { email, password } = request.body;

    // TODO: Validation + prevent SQL injection

    if (email && password) {
        db_pool.AuthPool.query(`SELECT * FROM account WHERE email='${email}'`, (error, results) => {
            if (error) {
                console.log(error);
                console.log('Invalid login details');
                return response.redirect('/login');
            } else {
                console.log(`Results found: ${results.rows.length}`);
                if (results.rows.length == 1 && results.rows[0].email === email && results.rows[0].password === password) {
                    request.session.userId = results.rows[0].id;
                    console.log('Successful login');
                    return response.redirect('/dashboard');
                } else {
                    console.log('Invalid login details');
                    response.redirect('/login');
                }
            }
        });
    }
}

const logout = (request, response) => {
    request.session.destroy(error => {
        if (error) {
            return response.redirect('/dashboard');
        }
        response.clearCookie(SESS_NAME);
        response.redirect('/');
    });
}

const localiser_auth = {
    saveUserProfileToLocal,
    getUsers,
    createUser,
    login,
};

export default localiser_auth;