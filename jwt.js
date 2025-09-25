const jwt = require('jsonwebtoken');
require("dotenv").config();

const jwt_key = process.env.JWT_KEY;

const jwtAuthMiddleware = async(req, res, next) => {
        const authHeader = req.headers.authorization;
        if(!authHeader ||!authHeader.startsWith('Bearer ')){
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authHeader.split(" ")[1];
        if(!token) return res.status(403).json({ message: 'No token provided' });
    try{
        const decode = jwt.verify(token, jwt_key);
        req.user = decode;
        next();
    } catch(err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

const generateToken = (payload) =>{
    return jwt.sign(payload, jwt_key, { expiresIn: '12hr' });
}

module.exports = { jwtAuthMiddleware,generateToken}