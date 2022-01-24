const config = require('config');
const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
    let token = null;

    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return res.status(403).json({ error: "A token is required for auth" });
    }

    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: "Invalid token", err });
    }

    return next();
}