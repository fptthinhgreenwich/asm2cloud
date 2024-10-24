var express = require('express');
var router = express.Router();
var display_shopuser_page = require('../controllers/shopusersController');

router.get('/', function(req, res, next) {
    display_shopuser_page(req, res);
});

module.exports = router;
