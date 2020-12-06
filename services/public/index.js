const express = require('express');
const router = express.Router();
const Data = require("./controllers/data");
const {verify} = require('./middleware/authentication');

router.get('/data', verify, Data.getData);
router.get('/data/:id', verify, Data.getSingleData);
router.post('/data', verify, Data.addData);
router.put('/data', verify, Data.updateData);
router.delete('/data/:id', verify, Data.deleteData)

module.exports = router;
