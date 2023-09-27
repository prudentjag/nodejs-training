
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
   try {
     const token = req.headers.authorization.split(" ")[1]; // Corrected 'headers' property
     const decode = jwt.verify(token, process.env.jwt_key);
     req.userData = decode;
     next();
   } catch (error) {
     res.status(401).json({
       error: "Unauthenticated: "  // Improved error message
     });
   } 
}

exports.restrict = (role) => {
  return (req, res, next) =>  {
    if(req.userData.role !== role){
        res.status(403).json({
          message : "You dont have permission to perform this action"
        })
        next()
    }
    next()
  }
}

// when you want to pass multiple roles to a route (''' puts it in an array)
exports.restricts = (...role) => {
  return (req, res, next) => {
    if(!role.includes(req.userData.role)){
       res.status(403).json({
          message : "You dont have permission to perform this action"
        })
        next()
    }
    next()
  }
}
//module.exports = [tokengenerator, restrict]