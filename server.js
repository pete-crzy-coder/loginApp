import dotenv from 'dotenv';
dotenv.config();

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import app from './app.js';

/**
 * Express app logging middleware.
 * Logs incoming requests in Apache combined format.
 */
app.use(morgan('combined'));

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
 * Port to run the HTTPS server on.
 * Defaults to 3000 if SERVER_PORT environment variable is not set.
 * @type {number|string}
 */
const port = process.env.SERVER_PORT || 3000;

/**
 * HTTPS server options containing certificate and key.
 * Reads cert.crt and key.crt from ./certs relative to this file.
 * @type {{ cert: Buffer, key: Buffer }}
 */
const options = {
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.crt')),
    key: fs.readFileSync(path.join(__dirname, 'certs', 'key.crt')),
};

/** * 404 Not Found handler for the Express app.
 * Serves a custom 404 HTML page.
 * 
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
app.use((req, res, next) => {
    res.status(404).header('Content-Type', 'text/html').send(fs.readFileSync(path.join(__dirname, '.html', '404.html')));
});

/**
 * Global error handler for the Express app.
 * Logs the error stack to console and sends a 500 response.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @param {Error} err
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

/**
 * Creates and starts an HTTPS server with the configured Express app.
 * Logs a message when the server is running.
 */
https.createServer(options, app).listen(port, () => {
    console.log(`HTTPS server running on port https://localhost:${port}.`);
});
