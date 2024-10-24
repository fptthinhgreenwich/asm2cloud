var express = require('express');
var router = express.Router();
var display_admin_page = require('../controllers/get_admins_controller');
var { edit_product_page, update_product } = require('../controllers/edit_product_controller');

/* GET /admins page. */
router.get('/', display_admin_page);

/* GET /admins/edit/:id page for editing product */
router.get('/edit/:id', edit_product_page);

/* POST /admins/update for updating product */
router.post('/update', update_product);

module.exports = router;
