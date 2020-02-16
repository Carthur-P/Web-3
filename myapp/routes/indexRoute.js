let express = require('express');
let router = express.Router();
const indexController = require('../controller/indexController');

router.get('/', indexController.getPage);
router.get('/home', indexController.getPage);
router.get('/index', indexController.getPage);

module.exports = router;
