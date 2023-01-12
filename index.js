const express = require('express');
const mongoose = require('mongoose')
const authRoute = require('./routes/trainingRoute.js')
const catRoute = require('./routes/categoryRoute.js')


const app = express()
app.use(express.json())

// database connection
mongoose.set('strictQuery', true)
// const db = "mongodb+srv://backend:backend123@cluster0.vlchgdj.mongodb.net/?retryWrites=true&w=majority"


const db = "mongodb://127.0.0.1:27017/login"
mongoose.set("strictQuery",true)
mongoose.connect(db, {useNewUrlParser:true,
useUnifiedTopology:true}).then(()=>{
    console.log("connected successfully")
}).catch((err)=>{
    console.log(err)
})

app.listen(8800, ()=>{
  console.log('server connected')
})

// route
app.use('/training', authRoute)
app.use('/category', catRoute)
