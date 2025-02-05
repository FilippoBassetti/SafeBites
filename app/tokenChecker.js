const jwt = require('jsonwebtoken');

function tokenChecker(req, res, next) {
    // Get token from header, body, or query
    const token = req.headers['x-access-token'] || req.body.token || req.query.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided.'
        });
    }

    // Verify token using the secret key
    jwt.verify(token, process.env.SUPER_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Failed to authenticate token.'
            });
        }
        
        // Attach the decoded user id to the request object
        req.user = { id: decoded.id };
        next();
    });
}

module.exports = tokenChecker;