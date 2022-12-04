const {verify} = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const accessToken = req.header('x-access-token');

    if (!accessToken) return res.status(401).json({auth: false, error: 'Unauthorized'});

    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET);
        if (validToken) {
            return next();
        }
    } catch(err){
        return res.status(403).json({auth: false, error: err});
    }
};

module.exports = { validateToken };