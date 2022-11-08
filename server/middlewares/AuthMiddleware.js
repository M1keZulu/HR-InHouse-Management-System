const {verify} = require('jsonwebtoken');

const validateToken = (req, res, next => {
    const accessToken = req.header('accessToken');

    if (!accessToken) return res.json({auth: false, error: 'Unauthorized'});

    try {
        const validToken = verify(accessToken, process.env.JWT_SECRET);
        if (validToken) {
            return next();
        }
    } catch(err){
        return res.json({ error: err });
    }
});

module.exports = {validateToken};