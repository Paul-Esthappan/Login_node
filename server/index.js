const express = require('express')
const dotenv = require('dotenv').config();
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
app.use(cors());

const port = process.env.PORT || 5000

mongoose.connect(process.env.Mongo_DB).then((data)=> {
    console.log("database connected");
}).catch((err) => {
    console.log("error", err);
})


app.use(express.json());
app.use("/api/log", require('./Router/router'))

app.use('/api/updates', require('./Router/updaterouter'))
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
