const pool = require("../models/pg_connector");

async function display_user_page(req, res) {
    if (req.session.authented && req.session.role_id === 4) {
        let shop_id = 1;
        if (req.body.shops) {
            shop_id = parseInt(req.body.shops);
        }
        let table = await generate_table(shop_id);
        
        res.render('users', { 
            title: 'USER PAGE',
            products_table: table,
        });
    } else {
        res.redirect('/');
    }
}

async function generate_table(shop_id) {
    let table = "";
    let query = "";
    if (shop_id == 1) {
        query = `SELECT * FROM products`;
    } else {
        query = {
            text: 'SELECT * FROM products WHERE shop_id = $1',
            values: [shop_id],
        };
    }
    try {
        const result = await pool.query(query);
        const rows = result.rows;
        const fields = result.fields;

        // Thêm class vào bảng và các thẻ liên quan
        table = `<table class="product-table"><thead><tr>`;
        
        // Generate header
        let col_list = [];
        for (let field of fields) {
            table += `<th class="product-header">${field.name}</th>`;
            col_list.push(field.name);
        }
        table += `<th class="product-header">Edit</th><th class="product-header">Delete</th></tr></thead><tbody>`; 

        // Generate rows
        for (let row of rows) {
            table += `<tr class="product-row">`;
            for (let col of col_list) {
                let cell = row[col];
                table += `<td class="product-cell">${cell}</td>`;
            }

            table += `<td class="product-cell"><a class="edit-link" href="/users/edit/${row.id}">Edit</a></td>`;
            table += `<td class="product-cell">
                          <form action="/users/delete/${row.id}" method="POST" class="delete-form">
                              <button type="submit" class="delete-button" onclick="return confirm('Are you sure you want to delete this product?');">Delete</button>
                          </form>
                      </td>`;
            table += `</tr>`;
        }
        table += `</tbody></table>`;
        
    } catch (err) {
        console.log(err);
        table = "Cannot connect to DB";
    }
    return table;
 
}

module.exports = display_user_page;
