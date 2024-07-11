const express = require("express")
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000;

const {createTables} = require("./db")

const init = async() => {
    const response = await createTables()
    app.listen(PORT, ()=>{
        console.log(`Hello from port number ${PORT}`)
    })
} 

init()