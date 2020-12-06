const Data = require("../../database/models/Data");
const { logger } = require("../../helper/logger");

exports.getData = async (req, res) => {
  try {
    let data = await Data.find().select('-_id -__v');
    res.status(200).send(data);
  } catch (e) {
    logger.error(String(e.message));
    res.send({ status: false, message: e.message });
  }
};

exports.getSingleData = async (req, res) => {
  try {
    if(!req.params || !req.params.id || isNaN(parseInt(req.params.id))){
      return res.status(405).send({ status: false, message: "Please provide valid id to fetch data!!" })
    }
    let data = await Data.findOne({id: req.params.id}).select('-_id -__v');
    res.status(200).send(data);
  } catch (e) {
    logger.error(String(e.message));
    res.send({ status: false, message: e.message });
  }
};

exports.addData = async (req, res) => {
  let data = new Data();
  if (!req.body || !Object.keys(req.body).length) {
    return res.status(400).send("Please provide information to save!!");
  }

  try {
        if(!req.body["id"] || isNaN(parseInt(req.body["id"]))){
            let dataWithMaxCount = await Data.findOne().select("id -_id").sort("-id");
            data["id"] = dataWithMaxCount && dataWithMaxCount["id"] ? parseInt(dataWithMaxCount["id"]) + 1 : 1;
        }else{
            return res.status(405).send({ status: false, message: "You can not pass id in request body to insert data!!" })
        }
        for (const key in req.body) {
        data[key] = req.body[key];
        }
        await data.save();
        res.status(200).send({ status: true, message: "Data added successfully !!" });
  } catch (e) {
    logger.error(String(e.message));
    res.send({ status: false, message: e.message });
  }
};


exports.updateData = async (req, res) => {
    
    if (!req.body || !Object.keys(req.body).length) {
      return res.status(400).send("Please provide information to update!!");
    }
  
    try {
          if(!req.body["id"] || isNaN(parseInt(req.body["id"]))){
            return res.status(405).send({ status: false, message: "Please provide valid id to update data!!" })
          }
          let resp = await Data.findOneAndUpdate({id: req.body.id}, req.body);
          if(resp){
            res.status(200).send({ status: true, message: "Data updated successfully !!" });
          }else{
            res.status(404).send({ status: false, message: `There is no record available with ${req.body.id} id` });
          }
    } catch (e) {
      logger.error(String(e.message));
      res.send({ status: false, message: e.message });
    }
};


exports.deleteData = async (req, res) => {

    try {
        if(!req.params || !req.params.id || isNaN(parseInt(req.params.id))){
          return res.status(405).send({ status: false, message: "Please provide valid id to delete data!!" })
        }
        let resp = await Data.findOneAndRemove({id: req.params.id});
        console.log(resp)
        if(resp){
          res.status(200).send({ status: true, message: "Data deleted successfully !!" });
        }else{
          res.status(404).send({ status: false, message: `There is no record available with ${req.params.id} id` });
        }
  } catch (e) {
    logger.error(String(e.message));
    res.send({ status: false, message: e.message });
  }

}