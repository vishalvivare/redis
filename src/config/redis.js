const {createClient}= require("redis");

const client= createClient({url:"redis://localhost:6379"});

client.on_connect("error", function (err){
    console.log({message:err.message});
});


module.exports= client;