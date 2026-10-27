import express from 'express';
import session from "express-session";

import postRoutes from './routes/posts.js';
import userRoutes from './routes/user.js';
import htmlPages from './routes/html.js';

/**
 * Main Express application instance.
 * Responsible for middleware setup and route mounting.
 *
 * Mounted route groups:
 * - /api/posts → Post-related API endpoints
 * - /api/user  → User authentication and management endpoints
 * - /          → HTML page routes
 *
 * @type {import('express').Express}
 */
const app = express();

/**
 * Middleware for parsing incoming JSON and form request bodies.
 * Populates `req.body`.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET ?? "5OOStZxyHfdsKXzAvC3yb2aSyZNQmDcj",
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            httpOnly: true,
            maxAge: 20 * 60 * 1000, // 20 minutes
        },
    })
);

/**
 * Mounts post-related API routes.
 * Base path: /api/posts
 */
app.use('/api/posts', postRoutes);

/**
 * Mounts user-related API routes.
 * Base path: /api/user
 */
app.use('/api/user', userRoutes);

/**
 * Mounts HTML page routes.
 * Base path: /
 */
app.use('/', htmlPages);

/**
 * Exports the configured Express application.
 * Typically imported by the server entry file.
 */
export default app;
