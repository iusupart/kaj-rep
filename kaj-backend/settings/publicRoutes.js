const BaseRoutes = require('./baseRoutes');
const UserController = require('../controller/userController');

/**
 * PublicRoutes class
 *
 * This class extends the BaseRoutes class and defines public routes for login and registration.
 */
class PublicRoutes extends BaseRoutes {
  /**
   * Constructor method for PublicRoutes class
   *
   * @param {object} io - The Socket.IO instance
   */
  constructor(io) {
    super(io.of("/public"));
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  /**
   * Method to start the public routes
   */
  start() {
    this.io.on('connection', (socket) => {
      socket.on('login', (data) => this.login(socket, data));
      socket.on('register', (data) => this.register(socket, data));
    });
  }

  /**
   * Method to handle login requests
   *
   * @param {object} socket - The Socket.IO socket object
   * @param {object} data - The login credentials
   */
  async login(socket, { email, password }) {
    const response = await UserController.loginUser(email, password);
    socket.emit('login-response', response);
  }

  /**
   * Method to handle registration requests
   *
   * @param {object} socket - The Socket.IO socket object
   * @param {object} data - The registration credentials
   */
  async register(socket, { email, password }) {
    const response = await UserController.registerUser(email, password);
    socket.emit('register-response', response);
  }
}

module.exports = PublicRoutes;