const express = require('express');
const router = express.Router();
const submitController = require("../controllers/submit-controller");

router.post("/submit", submitController.submit)



module.exports = router;