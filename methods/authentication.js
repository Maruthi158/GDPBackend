const jwt = require('jsonwebtoken')
const user = require('../collection')

const Authentication = async (req, res, next) => {
try {
        if (typeof(req.cookies.jwtToken) === "undefined") {
            console.log("page is not found")
            res.json({success:0})
        }else {
          const cookieToken = req.cookies.jwtToken;
          const verifyToken = jwt.verify(cookieToken, "BearcatStudyBuddyProject")

          const verifyUser = await user.findOne({ _id: verifyToken._id, token: cookieToken })      
          
        }
  
  
}
module.exports = Authentication
