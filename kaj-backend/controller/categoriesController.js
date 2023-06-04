'use strict'
/**
* CategoriesController class responsible for managing categories in the database.
*/
const connection = require('../settings/db');

class CategoriesController {
    /**
    * Constructs a new instance of CategoriesController.
    */
    constructor() {
        this.collectionName = "categories"
    }

    /**
     * Retrieves the database collection for categories.
     * @returns {Promise} A promise that resolves to the categories collection.
     */
    async getDbCollection() {
        return await connection.db("dayplanner").collection(this.collectionName);
    }
    
    /**
     * Adds a new category to the database.
     * @param {Object} data - The category data to be added.
     * @param {string} email - The email associated with the category.
     * @returns {Object} An object indicating the success status and a message.
     */
    async addNewCategory(data, email) {
        try {
            data.email = email;
            const collection = await this.getDbCollection();
            await collection.insertOne(data);
            return { success: true, message: 'Category was successfully added!' };
        } catch (err) {
            console.error(err);
            return { success: false, message: err };
        }
    }

    /**
     * Retrieves categories associated with a specific email.
     * @param {string} email - The email to retrieve categories for.
     * @returns {Object} An object indicating the success status and the retrieved categories.
     */
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