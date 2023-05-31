const BaseRoutes = require('./BaseRoutes');
const UserController = require('../controller/UserController');

class PublicRoutes extends BaseRoutes {
    constructor(io) {
        super(io.of("/public"));
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    start() {
        this.io.on('connection', (socket) => {
            socket.on('login', (data) => this.login(socket, data));
            socket.on('register', (data) => this.register(socket, data));
        });
    }

    async login(socket, { email, password }) {
        console.log(`Login request received from user: ${email}`);
        const response = await UserController.loginUser(email, password);
        socket.emit('login-response', response);
    }

    async register(socket, { email, password }) {
        console.log(`Registration request received from user: ${email}`);
        const response = await UserController.registerUser(email, password);
        socket.emit('register-response', response);
    }
}


module.exports = PublicRoutes;