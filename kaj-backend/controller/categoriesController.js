'use strict'

const connection = require('../settings/db');

class CategoriesController {
    constructor() {
        this.collectionName = "categories"
    }

    async getDbCollection() {
        return await connection.db("dayplanner").collection(this.collectionName);
    }

    async addNewCategory(data, email) {
        try {
            data.email = email;
            const collection = await this.getDbCollection();
            await collection.insertOne(data);
            return { success: true, message: 'Category was successfully added!' }
        } catch (err) {
            console.error(err);
            return { success: false, message: err };       
        }
    }

    async getCategories(email) {
        try {
            const collection = await this.getDbCollection();
            const categories = await collection.find({
                "email": email
            }).toArray();
            return {success: true, categories};
        } catch (err) {
            return { success: false, message: err }; 
        }
    }
}

module.exports = CategoriesController;