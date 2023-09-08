exports.connect = (req, res, next) => {
    const mongoose = require('mongoose');

    const uri = `${process.env.MONGODB_URI}`;

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 30000,
        ssl: true,
        retryWrites: true
    };

    mongoose.connect(uri, options);

    next();
};
