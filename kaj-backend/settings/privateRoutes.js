const BaseRoutes = require('./BaseRoutes');
const EventController = require('../controller/EventController');
const eventController = new EventController();

const CategoriesController = require('../controller/CategoriesController');
const categoriesController = new CategoriesController();

/**
 * PrivateRoutes class
 *
 * This class extends the BaseRoutes class and defines private routes for authenticated users.
 */
class PrivateRoutes extends BaseRoutes {
    /**
     * Constructor method for PrivateRoutes class
     *
     * @param {object} io - The Socket.IO instance
     */
    constructor(io) {
      super(io.of("/private"));
    }
  
    /**
     * Method to start the private routes
     */
    start() {
      this.io.use(this.verifyToken);
      this.io.on('connection', (socket) => {
        socket.on('add-new-event', (data) => this.addNewEvent(socket, data, socket.decoded.email));
        socket.on('get-events-by-date', (data) => this.getEventsByDate(socket, data, socket.decoded.email));
        socket.on('get-events-by-interval', (data) => this.getEventsByInterval(socket, data, socket.decoded.email));
        socket.on('delete-event', (data) => this.deleteEvent(socket, data));
        socket.on('add-new-category', (data) => this.addNewCategory(socket, data, socket.decoded.email));
        socket.on('get-all-categories', () => this.getCategories(socket, socket.decoded.email));
        socket.on('search', (data) => this.getSearch(socket, data, socket.decoded.email));
      });
    }
  
    /**
     * Method to add a new event
     *
     * @param {object} socket - The Socket.IO socket object
     * @param {object} data - The event data
     * @param {string} email - The user's email
     */
    async addNewEvent(socket, data, email) {
      const response = await eventController.addNewEvent(data, email);
      socket.emit('add-new-event-response', response);
    }
  
    /**
     * Method to get events by date
     *
     * @param {object} socket - The Socket.IO socket object
     * @param {object} data - The data containing the date and email
     * @param {string} email - The user's email
     */
    async getEventsByDate(socket, data, email) {
      data.email = email;
      const response = await eventController.getEventsByDate(data);
      socket.emit('get-events-by-date-response', response);
    }
  
    /**
     * Method to get events by interval
     *
     * @param {object} socket - The Socket.IO socket object
     * @param {object} data - The data containing the date interval and email
     * @param {string} email - The user's email
     */
    async getEventsByInterval(socket, data, email) {
      const response = await eventController.getEventsByInterval(data.data, email);
      socket.emit('get-events-by-interval-response', response);
    }
  
    /**
     * Method to delete an event
     *
     * @param {object} socket - The Socket.IO socket object
     * @param {object} data - The event data to be deleted
     */
    async deleteEvent(socket, data) {
      const response = await eventController.deleteEvent(data._id);
      console.log(response);
      socket.emit('delete-event-response', response);
    }
  
    /**
     * Method to add a new category
     *
     * @param {object} socket - The Socket.IO socket object
     * @param {object} data - The category data
     * @param {string} email - The user's email
     */
    async addNewCategory(socket, data, email) {
      const response = await categoriesController.addNewCategory(data, email);
      socket.emit('add-new-category-response', response);
    }
  
    /**
     * Method to get all categories
     *
     * @param {object} socket - The Socket.IO socket object
     * @param {string} email - The user's email
     */
    async getCategories(socket, email) {
      const response = await categoriesController.getCategories(email);
      socket.emit('get-all-categories-response', response);
    }
  
    /**
     * Method to perform a search for events
     *
     * @param {object} socket - The Socket.IO socket object
     * @param {object} data - The search query and user's email
     * @param {string} email - The user's email
     */
    async getSearch(socket, data, email) {
      data.email = email;
      const response = await eventController.getAllEventsSearch(data);
      socket.emit('search-response', response);
    }
  }
  
  module.exports = PrivateRoutes;