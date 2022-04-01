const express = require("express");
const client = require("../config/redis");
const app = express();

const Product = require("../model/productModel");

app.post("/", async (req, res) => {
    try {
        const products = await Product.create(req.body);

        const prods = await Product.find().lean().exec();

        client.set("prods", JSON.stringify(prods));

        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

app.get("/", async (req, res) => {
    try {
      client.get("prods", async function (err, fetchedProd) {
        if (fetchedProd) {
          const prods = JSON.parse(fetchedProd);
  
          return res.status(200).send({ prods, redis: true });
        } else {
          try {
            const prods = await Product.find().lean().exec();
  
            client.set("prods", JSON.stringify(prods));
  
            return res.status(200).send({ prods, redis: false });
          } catch (err) {
            return res.status(500).send({ message: err.message });
          }
        }
      });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });

  app.get("/:id", async (req, res) => {
    try {
      client.get(`prods.${req.params.id}`, async function (err, fetchedProds) {
        if (fetchedProds) {
          const prods = JSON.parse(fetchedProds);
  
          return res.status(200).send({ prods, redis: true });
        } else {
          try {
            const prods = await Product.findById(req.params.id).lean().exec();
  
            client.set(`prods.${req.params.id}`, JSON.stringify(prods));
  
            return res.status(200).send({ prods, redis: false });
          } catch (err) {
            return res.status(500).send({ message: err.message });
          }
        }
      });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });


  app.patch("/:id", async(req, res)=>{
      try {
         const products= await Product.findByIdAndUpdate(req.params.id, req.body, {
             new:true
         });
         const prods= await Product.find().lean().exec();

         client.set(`prods.${req.params.id}`, JSON.stringify(prods))
         client.set("prods", JSON.stringify(prods));

         return res.status(200).send(prods);
      } catch (error) {
        return res.status(500).send({ message: err.message }); 
      }
  })


  app.delete("/:id", async(req, res)=>{
      try {
          const products= await Product.findByIdAndDelete(req.params.id);

          const prods= await Product.find().lean().exec();

          client.set(`prods.${req.params.id}`, JSON.stringify(prods));
          client.set("prods", JSON.stringify(prods));

          res.status(200).send(prods)
      } catch (error) {
          
      }
  })


module.exports = app;

