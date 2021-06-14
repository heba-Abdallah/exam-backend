'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const server=express();

require('dotenv').config();
server.use(cors());
server.use(express.json());
const PORT = process.env.PORT;
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/DB_NAME',{ useNewUrlParser: true, useUnifiedTopology: true });

const digimonSchema = new mongoose.Schema({
 
  name:String,
  img:String,
  level:String,
});

const myDigimonModel=mongoose.model('digimon',digimonSchema)


server.get('/', testHandler);

server.get('/digimon', digimonHandler);
server.post('/addToFav',addToFavHandler);
server.get('/getFavDigimons',getFavDigimonHandler)

function testHandler(req, res) {
    res.send('home page')
}

function digimonHandler(req, res) {
    console.log(req.query);
    const digimon = req.query;
    const url = `https://digimon-api.vercel.app/api/digimon`;
    axios.get(url).then(result => {
        console.log('h',result.data);
        const digimonArr = result.data

        return new Digimon(digimon);
    })
}

function addToFavHandler(req,res){
    console.log('hi',req.body);
    const {name,img,level}=req.body;
    const newDigimon=new myDigimonModel({
        name:name,
        img:img,
        level:level
    })
    newDigimon.save();

}

function getFavDigimonHandler(req,res){
    myDigimonModel.find({},(error,favData)=>{
        res.send(favData)
    })
}

class Digimon {
    constructor(data){
        this.name=data.name;
        this.img=data.img;
        this.level=data.level
    }
}

server.listen(PORT, () => {
    console.log(`Listen to PORT ${PORT}`);
})