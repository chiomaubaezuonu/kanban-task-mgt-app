const express = require('express')

const app = express();

const port = "5000";

app.get('/', (req, res) => {
    res.status(200).json("Kanban home page")
})
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
} )