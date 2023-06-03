'use strict'

const connection = require('../settings/db');
const { ObjectId } = require('mongodb');

class EventController {
    constructor() {
        this.collectionName = "events";
    }

    async getDbCollection() {
        return await connection.db("dayplanner").collection(this.collectionName);
    }

    async addNewEvent(event, email) {
        try {
            event.email = email;
            const collection = await this.getDbCollection();
            await collection.insertOne(event);
            return { success: true, message: 'Event was successfully added!' }
        } catch (err) {
            console.error(err);
            return { success: false, message: err };       
        }
    }

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

    async getEventsByInterval(data) {
        const from = data.from;
        const to = data.to;
        const email = data.email;
        try {
            const collection = await this.getDbCollection();
            const events = await collection.find ({
                "email": email,
                $or: [
                    { dateFrom: { $gte: from, $lte: to } },
                    { dateTo: { $gte: from, $lte: to } }
                ]
            }).toArray();  
            return { success: true, events };
        } catch (err) {
            return { success: false, message: err };
        }
    }

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
