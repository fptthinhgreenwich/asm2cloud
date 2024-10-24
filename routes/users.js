var express = require('express');
var router = express.Router();
var display_admin_page = require('../controllers/get_users_controller');
var pool = require('../models/pg_connector');


router.get('/', function(req, res, next) {
    display_admin_page(req, res);
});


router.post('/', function(req, res, next) {
    console.log(req.body);
    display_admin_page(req, res);
});

router.get('/create', (req, res) => {
    res.render('create_product', { title: 'Create Product' }); 
});

router.post('/create', async (req, res) => {
    const { product_name, amount, price, shop_id } = req.body;

    try {
        const query = {
            text: 'INSERT INTO products (product_name, amount, price, shop_id) VALUES ($1, $2, $3, $4)',
            values: [product_name, amount, price, shop_id],
        };
        await pool.query(query);
        res.redirect('/users');
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).send('Error creating product');
    }
});

router.get('/edit/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
        const product = result.rows[0];

        if (product) {
            res.render('edit_product', { product });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Error retrieving product data');
    }
});

router.post('/edit/:id', async (req, res) => {
    const productId = req.params.id;
    const { product_name, amount, price, shop_id } = req.body;

    try {
        await pool.query(
            'UPDATE products SET product_name = $1, amount = $2, price = $3, shop_id = $4 WHERE id = $5',
            [product_name, amount, price, shop_id, productId]
        );

        res.redirect('/users');
    } catch (err) {
        console.error('Database update error:', err.message);
        res.status(500).send('Error updating product data');
    }
});

router.post('/delete/:id', async (req, res) => {
  const productId = req.params.id;

  try {
      await pool.query('DELETE FROM products WHERE id = $1', [productId]);
      res.redirect('/users');
  } catch (err) {
      console.error('Database delete error:', err.message);
      res.status(500).send('Error deleting product data');
  }
});

module.exports = router;
