import mongoose from "mongoose"

const URI="mongodb+srv://cjcrr:cruz0606@cluster0606.qoy5tos.mongodb.net/ecommerce?retryWrites=true&w=majority"

await mongoose.connect(URI,{
    serverSelectionTimeoutMS:5000,
})
console.log("Base de datos conectada")