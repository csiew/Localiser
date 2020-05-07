// LIBRARIES AND FRAMEWORKS
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import connectPgSimple from 'connect-pg-simple';

// DATABASE CONNECTIVITY
import db_pool from './db_pool.js';

// QUERIES or VIEWS
import localiser_auth from './authentication.js';

const app = express();
const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;


// PARAMETERS (modifiable by administrator)

const {
    PORT = 3000,
    SESS_NAME = 'sid',
    SESS_SECRET = 'wombat koala kangaroo',
    SESS_LIFETIME = THIRTY_DAYS,      // cookie lifetime for auth
    NODE_ENV = 'development'
} = process.env;

const IN_PROD = NODE_ENV === 'production';

const pgSession = connectPgSimple(session);


// PARSING
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);


// SESSION COOKIE

app.use(
    session({
        name: SESS_NAME,
        resave: false,
        saveUninitialized: false,
        secret: SESS_SECRET,
        store: new pgSession({
            pool: db_pool.AuthPool,     // Connection pool (which database)
            tableName: 'session',       // Specific session store table
        }),
        cookie: {
            maxAge: SESS_LIFETIME,
            sameSite: true,             // default: 'strict'
            secure: IN_PROD
        }
    })
);


// ENDPOINTS

const redirectLogin = (request, response, next) => {
    if (!request.session.userId) {
        // Session object still uninitialised
        response.redirect('/login');
    } else {
        next();
    }
}

const redirectHome = (request, response, next) => {
    if (request.session.userId) {
        response.redirect('/dashboard');
    } else {
        next();
    }
}

// Save user profile data locally for quick access.
/*
app.use(localiser_auth.saveUserProfileToLocal, (request, response) => {
    if (request.locals.user) {
        response.locals.user = request.locals.user;
    }
});
*/

app.get('/info', (request, response) => {
    response.json({
        info: 'Localiser - built with NodeJS, Express, ReactJS, and a little caffeine.'
    });
});

app.get('/', redirectHome, (request, response) => {
    const { userId } = request.session;
    
    response.send(`
        <html>
        <body>
            <h1>Localiser</h1>
            <ul>
                <li><a href="/login">Login</a></li>
                <li><a href="/signup">Sign Up</a></li>
            </ul>
            ${userId ? `
                <form method='post' action='/logout'>
                    <button>Logout</button>
                </form>
            ` : `
                <p>
                    Please login to see the dashboard.
                </p>
            `}
        </body>
        </html>
    `)
});

app.get('/dashboard', redirectLogin, (request, response) => {
    // const { given_name } = response.locals.user;
    const given_name = 'tba';
    
    response.send(`
        <html>
        <body>
            <h1>Localiser</h1>
            <h2>Welcome ${given_name}!</h2>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/">Categories</a></li>
                    <li><a href="/">Saved</a></li>
                    <li><a href="/">My Profile</a></li>
                </ul>
                <form method='post' action='/logout'>
                    <button>Logout</button>
                </form>
        </body>
        </html>
    `)
});

// For development purposes only.
app.get('/users', localiser_auth.getUsers);

app.get('/login', redirectHome, (request, response) => {
    console.log(request.sessionID);
    response.send(`
        <form method='post' action='/login'>
            <input type='email' name='email' placeholder='Email' required />
            <input type='password' name='password' placeholder='Password' required />
            <input type='submit' />
        </form>
        Don't have an account? <a href='/signup'>Sign Up</a>
    `)
});

app.get('/signup', redirectHome, (request, response) => {
    response.send(`
        <form method='post' action='/signup'>
            <input type='email' name='email' placeholder='Email' required />
            <input name='givenName' placeholder='Given Name' />
            <input name='familyName' placeholder='Family Name' />
            <input type='password' name='password' placeholder='Password' required />
            <input type='submit' />
        </form>
        Already have an account? <a href='/login'>Login</a>
    `)
});

app.post('/login', redirectHome, localiser_auth.login);

app.post('/signup', redirectHome, localiser_auth.createUser);

app.post('/logout', redirectLogin, (request, response) => {
    request.session.destroy(error => {
        if (error) {
            return response.redirect('/dashboard');
        }
        response.clearCookie(SESS_NAME);
        response.redirect('/');
    });
});


// SERVER FUNCTIONALITY
app.listen(PORT, () => {
    console.log(`Localiser service running at http://localhost:${PORT}`);
});
