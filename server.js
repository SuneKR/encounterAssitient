const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()

var corsOptions = {
  origin: "http://localhost:8081"
}

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const database = require("./models")
database.mongoose
    .connect(database.url, {  useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() => {  console.log("Mongolos connection encaged")  })
    .catch(error => {  console.log("No mongolos in the database!", error); process.exit()  })

app.get("/", (request, response) => {
  response.json({  message: "Welcome to battleAssistant"  })
})

require("./src/router/token.routes.js")(app)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})