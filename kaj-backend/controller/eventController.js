'use strict'

/**
 * EventController class responsible for managing events in the database.
 */
const connection = require('../settings/db');
const { ObjectId } = require('mongodb');

class EventController {
    /**
     * Constructs a new instance of EventController.
     */
    constructor() {
        this.collectionName = "events";
    }

    /**
     * Retrieves the database collection for events.
     * @returns {Promise} A promise that resolves to the events collection.
     */
    async getDbCollection() {
        return await connection.db("dayplanner").collection(this.collectionName);
    }

    /**
     * Adds a new event to the database.
     * @param {Object} event - The event data to be added.
     * @param {string} email - The email associated with the event.
     * @returns {Object} An object indicating the success status and a message.
     */
    async addNewEvent(event, email) {
        try {
            event.email = email;
            const collection = await this.getDbCollection();
    
            // Convert the dates and times into JS Date objects
            const newEventStart = new Date(event.dateFrom + "T" + event.timeFrom);
            const newEventEnd = new Date(event.dateTo + "T" + event.timeTo);
    
            // Find any existing events that overlap with the new event
            const existingEvents = await collection.find({
                email: email,
                $or: [
                    {
                        dateFrom: {
                            $lte: event.dateTo
                        },
                        timeTo: {
                            $gt: event.timeFrom
                        }
                    },
                    {
                        dateTo: {
                            $gte: event.dateFrom
                        },
                        timeFrom: {
                            $lt: event.timeTo
                        }
                    }
                ]
            }).toArray();
    
            // Check if there is a collision with an existing event
            for (let existingEvent of existingEvents) {
                const existingEventStart = new Date(existingEvent.dateFrom + "T" + existingEvent.timeFrom);
                const existingEventEnd = new Date(existingEvent.dateTo + "T" + existingEvent.timeTo);
    
                if (newEventStart < existingEventEnd && existingEventStart < newEventEnd) {
                    return { success: false, message: 'Event collision detected!' }; 
                }
            }
    
            await collection.insertOne(event);
            return { success: true, message: 'Event was successfully added!' }
        } catch (err) {
            console.error(err);
            return { success: false, message: err.message };       
        }
    }    

    /**
     * Retrieves events for a specific date and email.
     * @param {Object} data - The data containing the date and email.
     * @returns {Object} An object indicating the success status and the retrieved events.
     */
    async getEventsByDate(data) {
        const date = data.date;
        const email = data.email;
        try {
            const collection = await this.getDbCollection();
            const selectedDate = new Date(date);
            const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
            const events = await collection.find({
                "email": email,
                $or: [
                    { "dateFrom": { $eq: formattedSelectedDate } },
                    { "dateTo": { $eq: formattedSelectedDate } },
                    { "dateFrom": { $lte: formattedSelectedDate }, "dateTo": { $gte: formattedSelectedDate } }
                ]
            }).toArray();
            return { success: true, events };
        } catch (err) {
            return { success: false, message: err };
        }
    }

    /**
     * Retrieves events within a specified interval for a given email.
     * @param {Object} data - The data containing the interval (from and to) and the email.
     * @param {string} email - The email associated with the events.
     * @returns {Object} An object indicating the success status and the retrieved events.
     */
    async getEventsByInterval(data, email) {
        let from = data.from;
        let to = data.to;

        try {
            const collection = await this.getDbCollection();
            const events = await collection.find({
                "email": email,
                $or: [
                    { dateFrom: { $gte: from, $lte: to } },
                    { dateTo: { $gte: from, $lte: to } }
                ]
            }).toArray();  
            console.log(events)
            return { success: true, events };
        } catch (err) {
            return { success: false, message: err };
        }
    }

    /**
     * Deletes an event with the specified ID.
     * @param {string} id - The ID of the event to be deleted.
     * @returns {Object} An object indicating the success status.
     */
    async deleteEvent(id) {
        try {
            const collection = await this.getDbCollection();
            const _id = new ObjectId(id);
            const result = await collection.deleteOne({ _id });

            if (result.deletedCount === 1) {
                return { success: true };
            } else {
                return { success: false };
            }
        } catch (err) {
            return { success: false, message: err };            
        }
    }

    /**
     * Retrieves all events matching a search query for a given email.
     * @param {Object} data - The data containing the email and the search text.
     * @returns {Object} An object indicating the success status and the retrieved events.
     */
    async getAllEventsSearch(data) {
        try {
            const collection = await this.getDbCollection();
            const email = data.email;
            const text = data.text;

            const regex = new RegExp(text, 'i');

            const result = await collection.find({
                "email": email,
                $or: [
                    { title: { $regex: regex } },
                    { description: { $regex: regex } },
                ]
            }).toArray();
            return { success: true, result };
        } catch (err) {
            console.log(err)
            return { success: false, message: err };            
        }
    }
}

module.exports = EventController;