/**
 * BaseRoutes class
 *
 * This class serves as the base for both PrivateRoutes and PublicRoutes classes.
 * It provides common methods and a token verification method used by PrivateRoutes.
 */
class BaseRoutes {
    /**
     * Constructor method for BaseRoutes class
     *
     * @param {object} io - The Socket.IO instance
     */
    constructor(io) {
      this.io = io;
    }
  
    /**
     * Common method available for both PrivateRoutes and PublicRoutes
     */
    commonMethod() {}
  
    /**
     * Token verification method used by PrivateRoutes
     *
     * @param {object} socket - The Socket.IO socket object
     * @param {function} next - The callback function to continue the middleware chain
     */
    verifyToken(socket, next) {
      const jwt = require('jsonwebtoken');
      if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.SECRET_KEY, function(err, decoded) {
          if (err) {
            return next(new Error('Authentication error'));
          }
          socket.decoded = decoded;
          next();
        });
      } else {
        next(new Error('Authentication error'));
      }
    }
  }
  
  module.exports = BaseRoutes;  