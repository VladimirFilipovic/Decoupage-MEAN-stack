const jwt = require ('jsonwebtoken');

//exports this as a function
module.exports = (req, res, next) => {
  //after bearer [1] je token
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,"izgubio-sam-papuce");
    req.userData = {username:decodedToken.username, userId: decodedToken.userId}
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed'
    });
  }
};
