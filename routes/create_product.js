const express = require('express');
const router = express.Router();
const pool = require("../models/pg_connector");
var display_admin_page = require('../controllers/get_admins_controller');

router.get('/admins', display_admin_page);

router.get('/admins/create', (req, res) => {
    res.render('create_product', { title: 'Create Product' });
});

router.post('/admins/create', async (req, res) => {
    const { productName, price, quantity, shop_id } = req.body;

    try {
        const query = {
            text: 'INSERT INTO products (product_name, price, quantity, shop_id) VALUES ($1, $2, $3, $4)',
            values: [productName, price, quantity, shop_id],
        };
        await pool.query(query);
        res.redirect('/admins'); 
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).send('Error creating product');
    }
});

module.exports = router;
