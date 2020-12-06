const mongoose = require('mongoose');
const { logger } = require('../helper/logger');
const fs = require('fs');
const path = require('path');
const bfj = require('bfj');
const Data = require('./models/Data');


const insetDataJsonFileInDB = async (dataObject) => {

    try{       
        await Data.insertMany(dataObject);
        logger.log({
            "level"   : "info",
            "message" : `Data Seeding`,
            "label"   : "Data seeding completed successfully !!"
        })
    }catch(e){
        logger.error({
            "level"   : "error",
            "message" : `Data insertion Error`,
            "label"   : e.message
        })
    }
}


const readDataJsonFile = () => {

    try {

        const streamData = fs.createReadStream(path.join(__dirname, '../../') + 'data.json');
        bfj.match(streamData, (key, value, depth) => depth === 0, { ndjson: true })
        .on('data', object => {
            logger.log({
                "level"   : "info",
                "message" : `Data Seeding`,
                "label"   : "Wait reading data.json file and seeding in DB"
            })
            insetDataJsonFileInDB(object);
        })
        .on('dataError', error => {
                logger.error({
                "level"   : "error",
                "message" : `read data error`,
                "label"   : error.message
            })
        })
        .on('error', error => {
            logger.error({
                "level"   : "error",
                "message" : `read data operation error`,
                "label"   : error.message
            })
        })
        .on('end', error => {
            if(error){
                logger.error({
                    "level"   : "error",
                    "message" : `read data on end error`,
                    "label"   : error.message
                })
            }
        });

    }catch(e){
        logger.error({
            "level"   : "error",
            "message" : `Data Seeding Error`,
            "label"   : e.message
        })
    }
    
}

mongoose.connect('mongodb://localhost:27017/smsindia', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (e) => {
    logger.error({
        "level"   : "error",
        "message" : `connection error`,
        "label"   : e.message
    })
});

db.once('open', async(message) => {
    logger.log({
        "level"   : "info",
        "message" : `Database connected`,
        "label"   : message
    });
    
    let existingData = await Data.find().limit(10);
    if(!existingData || !existingData.length){
        readDataJsonFile();
    }
});


module.exports = db;