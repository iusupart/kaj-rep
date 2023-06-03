const BaseRoutes = require('./BaseRoutes');
const EventController = require('../controller/EventController');
const eventController = new EventController();

const CategoriesController = require('../controller/CategoriesController');
const categoriesController = new CategoriesController();


class PrivateRoutes extends BaseRoutes {
    constructor(io) {
        super(io.of("/private"));
    }

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

    async addNewEvent(socket, data, email) {
        const response = await eventController.addNewEvent(data, email);
        socket.emit('add-new-event-response', response);
    }

    async getEventsByDate(socket, data, email) {
        data.email = email;
        const response = await eventController.getEventsByDate(data);
        socket.emit('get-events-by-date-response', response);
    }

    async getEventsByInterval(socket, data, email) {
        data.email = email;
        const response = await eventController.getEventsByInterval(data.data);
        socket.emit('get-events-by-interval-response', response);
    }

    async deleteEvent(socket, data) {
        const response = await eventController.deleteEvent(data._id);
        console.log(response)
        socket.emit('delete-event-response', response);
    }

    async addNewCategory(socket, data, email) {
        const response = await categoriesController.addNewCategory(data, email);
        socket.emit('add-new-category-response', response);
    }

    async getCategories(socket, email) {
        const response = await categoriesController.getCategories(email);
        socket.emit('get-all-categories-response', response);       
    }

    async getSearch(socket, data, email) {
        data.email = email;
        console.log(data)
        const response = await eventController.getAllEventsSearch(data);
        socket.emit('search-response', response);
    }
}

module.exports = PrivateRoutes;
