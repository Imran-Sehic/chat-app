require("dotenv").config();

export const MongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster1.zapw9zv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;
