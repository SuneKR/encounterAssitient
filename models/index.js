const databaseConfiguration = require("../config/databaseConfig.js")

const mongoose = require("mongoose")

mongoose.Promise = global.Promise

const database = {}
database.mongoose = mongoose
database.url = databaseConfiguration.url
database.tokens =  require("./token.model.js")(mongoose)

module.exports = database