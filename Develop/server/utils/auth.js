const jwt = require('jsonwebtoken');
//set token secret and expiration date
const secret = 'mysecrets1234';
const expiration = '2h';

module.exports = {
  
  authMiddleware: function({ req }) {
    
    let token = req.body.token || req.query.token || req.headers.authorization;

    //["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: 'you have no token!' });
    }

    //verify token and get user data
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};