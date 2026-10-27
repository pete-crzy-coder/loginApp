import { Router } from 'express';
import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

import { requireAuth } from './user.js';

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
 * Express router instance for handling routes.
 * @type {import('express').Router}
 */
const router = Router();

/**
 * Serves the main index page and its aliases.
 *
 * Routes:
 * - /
 * - /index
 * - /index.html
 * - /home
 * - /dashboard
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
router.get(['/', '/index', '/index.html', '/home', '/dashboard'], requireAuth, async (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '..', '.html', 'index.html');
        const html = await fs.readFile(filePath);

        res
            .status(200)
            .header('Content-Type', 'text/html')
            .send(html);
    } catch (err) {
        next(err);
    }
});

/**
 * Serves the login page.
 *
 * Routes:
 * - /login
 * - /login.html
 *
 * @async
 * @function
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
router.get(['/login', '/login.html'], async (req, res, next) => {
    try {
        if (req.session.user) {
            return res.redirect(302, '/');
        }

        const filePath = path.join(__dirname, '..', '.html', 'login.html');
        const html = await fs.readFile(filePath);

        res
            .status(200)
            .header('Content-Type', 'text/html')
            .send(html);
    } catch (err) {
        next(err);
    }
});

router.get(['/signup.html', '/signup'], async (req, res, next) => {
    try {
        const filePath = path.join(__dirname, '..', '.html', 'signup.html');
        const html = await fs.readFile(filePath);

        res
            .status(200)
            .header('Content-Type', 'text/html')
            .send(html);
    } catch (err) {
        next(err);
    }
});

/**
 * Serves static assets such as images, CSS, and JavaScript files.
 *
 * Mounted directory:
 * ../.html/assets
 *
 * @type {import('express').RequestHandler}
 */
router.use(
    express.static(path.join(__dirname, '..', '.html', 'assets'))
);

export default router;
