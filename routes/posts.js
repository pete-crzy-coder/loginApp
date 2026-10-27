import Router from 'express';

const router = Router();

// create a new hck
router.post('/', (req, res, next) => {
    try {
        res.send(`You requested ${req.url} using the ${req.method} method`);
    } catch (err) {
        next(err);
    }
});

// get all posts
router.get('/', (req, res, next) => {
    try {
        res.send(`You requested ${req.url} using the ${req.method} method`);
    } catch (err) {
        next(err);
    }
});

// get a single post
router.get('/:id', (req, res, next) => {
    try {
        res.send(`You requested ${req.url} using the ${req.method} method`);
    } catch (err) {
        next(err);
    }
});

// update a post
router.put('/:id', (req, res, next) => {
    try {
        res.send(`You requested ${req.url} using the ${req.method} method`);
    } catch (err) {
        next(err);
    }
});

// delete a post
router.delete('/:id', (req, res, next) => {
    try {
        res.send(`You requested ${req.url} using the ${req.method} method`);
    } catch (err) {
        next(err);
    }
});

export default router;