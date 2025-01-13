const mongoose = require('mongoose'); 
const mongoURI = 'mongodb://localhost:27017/inotebook'; 


const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,      
            useUnifiedTopology: true,  
        });
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
};

module.exports = connectToMongo; 
