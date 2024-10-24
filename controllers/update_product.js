async function update_product(req, res) {
    const { id, product_name, amount, price, shop_id } = req.body; 
    try {
        await pool.query('UPDATE products SET product_name = $1, amount = $2, price = $3, shop_id = $4 WHERE id = $5',
            [product_name, amount, price, shop_id, id]);

        res.redirect('/users'); 
    } catch (err) {
        console.error('Database update error:', err);
        res.status(500).send('Error updating product data');
    }
}


