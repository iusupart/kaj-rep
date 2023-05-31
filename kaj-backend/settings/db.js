const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://iusupart:luugujuvyKDkLsPM@dayplanner.bn58rzs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect().then(() => {
    console.log('Connected to MongoDB!');
    const db = client.db("racing_info");
    module.exports = db;
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });

module.exports = client;