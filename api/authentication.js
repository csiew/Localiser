import db_pool from './db_pool.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

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
    db_pool.CorePool.query('SELECT * FROM user_account ORDER BY date_added ASC', (error, results) => {
        if (error) {
            console.log(error);
        }
        response.status(200).json(results.rows);
    });
};

// createUser
// type: POST
const createUser = (request, response) => {
    const { email, givenName, familyName, password } = request.body;
    const id = uuidv4();

    console.log('User creation starting...');

    // TODO: Validation + prevent SQL injection

    // Check for existing user with same email
    console.log('Checking if user with email already exists...');
    db_pool.AuthPool.query(`SELECT * FROM account WHERE email='${email}'`, (error, results) => {
        if (error || results.rows.length == 1) {
            console.log('Account with same email already exists');
            return response.redirect('/signup');
        }
    });

    // Hash password
    console.log('Generating password salt...');
    const salt = bcrypt.genSaltSync(10);
    console.log('Encrypting password...');
    const encryptedPassword = bcrypt.hashSync(password, salt);

    // Create authentication profile.
    console.log('Generating authentication profile...');
    db_pool.AuthPool.query(`INSERT INTO account (id, role_id, email, password) VALUES ('${id}', 'STANDARD', '${email}', '${encryptedPassword}')`, (error, result) => {
        if (error) {
            console.log('Unable to generate authentication profile');
            return response.redirect('/signup');
        }
        console.log(result.rows[0]);
        console.log(`Created user auth for ${email} with ID: ${id}`);

        // Only create user profile if authentication account was created.
        console.log('Generating user metadata profile...');
        db_pool.CorePool.query(`INSERT INTO user_account (id, email, given_name, family_name) VALUES ('${id}', '${email}', '${givenName}', '${familyName}')`, (error, result) => {
            if (error) {
                console.log('Unable to generate user profile');
                return response.redirect('/signup');
            }

            // Ensure account has been created, then login the user.
            db_pool.AuthPool.query(`SELECT * FROM account WHERE email='${email}'`, (error, results) => {
                if (error) {
                    console.log('Unable to confirm new user created');
                    return response.redirect('/signup');
                }
                console.log('Account successfully created, logging in...');
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
                if (results.rows.length == 1 && results.rows[0].email === email) {
                    console.log("Account found with matching email, now comparing password...");
                    bcrypt.compare(password, results.rows[0].password, (error, same) => {
                        if (error) {
                            console.log('Unable to login');
                            return response.redirect('/login');
                        }
                        if (same) {
                            request.session.userId = results.rows[0].id;
                            console.log('Successful login');
                            return response.redirect('/dashboard');
                        } else {
                            console.log('Invalid login details');
                            return response.redirect('/login');
                        }
                    });
                } else {
                    console.log('Invalid login details');
                    return response.redirect('/login');
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