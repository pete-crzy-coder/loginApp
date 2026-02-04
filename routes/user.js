import Router from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { findStringInJsonField, findStringInJsonField2 } from '../components/scanner.js';
import { readFile } from 'fs/promises';

/**
 * Absolute path to the current file.
 * Rebuilt for ES module compatibility.
 * @type {string}
 */
const __filename = fileURLToPath(import.meta.url);

/**
 * Directory name of the current module.
 * @type {string}
 */
const __dirname = path.dirname(__filename);

/**
 * Express router instance for authentication-related routes.
 * @type {import('express').Router}
 */
const router = Router();

/**
 * Creates a new user account.
 *
 * Expects the following fields in the request body:
 * - email
 * - username
 * - password
 *
 * Validates uniqueness of email and username,
 * hashes the password using bcrypt,
 * and stores the user as a JSON file.
 *
 * Route:
 * POST /signup
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
router.post('/signup', async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.username || !req.body.password) {
            return res.status(400).json({ message: 'Where\'s your info gone' });
        }

        const found =
            await findStringInJsonField(path.join(__dirname, '..', 'users'), 'email', req.body.email) ||
            await findStringInJsonField(path.join(__dirname, '..', 'users'), 'username', req.body.username);

        if (found) {
            return res.status(409).json({ message: 'Nope' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Snowflake-style ID generation
        let lastTime = 0;
        let seq = 0;

        function generateId() {
            const now = Date.now();
            if (now === lastTime) seq++;
            else {
                lastTime = now;
                seq = 0;
            }
            return `${now}-${seq}`;
        }
        const userId = generateId();
        await fs.writeFile(
            `./users/${userId}.json`,
            JSON.stringify(
                {
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword
                },
                null,
                4
            )
        );

        res.redirect('/login');
    } catch (err) {
        next(err);
    }
});

/**
 * Logs out the current user by destroying the session.
 * 
 * Route:
 * GET /logout
 * 
 * @function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {void}
 */

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});


/**
 * Authenticates an existing user.
 *
 * Accepts either a username or email in `req.body.auth`
 * and validates the provided password.
 *
 * Route:
 * POST /login
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
router.post('/login', async (req, res, next) => {
    try {
        if (req.session.user) {
            return res.redirect(302, '/');
        }

        if (!req.body.auth || !req.body.password) {
            return res.status(400).json({ message: 'Where’s your info gone' });
        }
        const matchfile =
            await findStringInJsonField2(
                path.join(__dirname, '..', 'users'),
                'username',
                req.body.auth
            ) ||
            await findStringInJsonField2(
                path.join(__dirname, '..', 'users'),
                'email',
                req.body.auth
            );

        if (!matchfile) {
            return res.status(401).json({ message: 'Nope' });
        }

        const file = await readFile(
            path.join(__dirname, '..', 'users', matchfile),
            'utf8'
        );
        const user = JSON.parse(file);

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Nope' });
        }

        // 🔒 THIS IS THE IMPORTANT PART
        req.session.user = {
            id: user.id ?? matchfile, // fallback if you don’t have IDs
            file: matchfile,
            username: user.username
        };

        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

/**
 * Middleware to check if a user is authenticated.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 */
export function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect(302, '/login');
    }
    next();
}


/**
 * Authentication router export.
 * Mount with `app.use('/auth', router)` or similar.
 */
export default router;
