import axios from "axios"

export default axios.create({
    baseURL: "http://127.0.0.1_8080/api",
    headers: {  "Content-type": "application/json"  }
})