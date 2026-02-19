const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if(!token){
        return res.status(401).json({message: "Access denied - No token provided"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({message: "Invalid token"});
    }
}

const admin = (req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(403).json({message: "Access denied"});
    }
    next();
}
const user = (req, res, next) => {
    if(req.user.role !== 'user'){
        return res.status(403).json({message: "Access denied"});
    }
    next();
}

module.exports = {auth, admin, user};
