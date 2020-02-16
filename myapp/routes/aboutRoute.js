let express = require('express');
let router = express.Router();
const indexController = require('../controller/aboutController');

router.get('/about', indexController.getPage);

module.exports = router;
