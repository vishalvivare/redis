const express= require("express");
const mongoose= require("mongoose");
const app= express();

app.use(express.json());

const connectDb=()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/Redis");
}

const prodController= require("./src/controllers/productController");

app.use("/products", prodController)

app.listen(5000, async()=>{
    try {
        await connectDb();
    } catch (error) {
        console.log(error.message)
    }
    console.log("Listening to port 5000")
})