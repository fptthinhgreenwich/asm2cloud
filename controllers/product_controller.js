const pool = require("../models/pg_connector");

function showCreateProductForm(req, res) {
    res.render('create_product', { title: 'Create Product' });
}

async function createProduct(req, res) {
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
}

module.exports = {
    showCreateProductForm,
    createProduct,
};
