class BaseRoutes {
    constructor(io) {
        this.io = io;
    }
   
    commonMethod() {}


    verifyToken(socket, next) {
        const jwt = require('jsonwebtoken');
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, process.env.SECRET_KEY, function(err, decoded) {
                if (err) {
                    console.log(err)
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