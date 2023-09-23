
const jwt = require('jsonwebtoken');

const tokengenerator = (req, res, next) => {
    try {
        const decode = jwt.verify(req.body.token, process.env.jwt_key);
        req.userData = decode 
        next()
    } catch (error) {
        res.status(401).json({
            error : "failed"
        })
    }
   
}

module.exports = tokengenerator