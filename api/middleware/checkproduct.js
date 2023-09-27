const Product = require('../models/product')

 const verify =   (req, res, next) => Product.find({ name: req.body.name }).then((result) => {
     if (result.length >= 1) {
       return res.status(401).json({
         message: "Product ALready exists",
       });
     }
   });

   module.export = verify