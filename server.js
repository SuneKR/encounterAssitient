const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const http = require('http')
const https = require('https')
const fs = require('fs')

const app = express()

var corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:8100"],
  default: "http://localhost:5173"
}

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const database = require("./models")
const { response } = require("express")
database.mongoose
    .connect(database.url, {  useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() => {  console.log("Mongolos connection encaged")  })
    .catch(error => {  console.log("No mongolos in the database!", error); process.exit()  })

app.get("/", (request, response) => {
  response.json({  message: "Welcome to battleAssistant"  })
})

require("./src/router/token.routes.js")(app)

const creds = {  key: fs.readFileSync("./ssl/key.pem"), cert: fs.readFileSync("./ssl/cert.pem")  }

httpServer = http.createServer(app)
httpsServer = https.createServer(creds, app)

const PORT = process.env.PORT || 8080
const SPORT = process.env.PORT || 8443

httpServer.listen(PORT, () => {  console.log(`Server is running on port ${PORT}.`)  })
httpsServer.listen(SPORT, () => {  console.log(`Secure server is running on port ${SPORT}.`)  })