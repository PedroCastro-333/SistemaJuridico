const mongoose = require("mongoose");

dbUrl = "mongodb://127.0.0.1:27017/escritorio";

const con = mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

module.exports = con