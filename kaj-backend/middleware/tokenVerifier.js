const jwt = require('jsonwebtoken');

class TokenVerifier {
    /**
     * Verifies the authentication token for a socket connection.
     * @param {object} socket - The socket connection object.
     * @param {function} next - The next middleware function.
     */
    static verifyToken(socket, next) {
        if (socket.handshake.query && socket.handshake.query.token){
            jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
                if (err) return next(new Error('Authentication error'));
                socket.decoded = decoded;
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    }
}

module.exports = TokenVerifier;
