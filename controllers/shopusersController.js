const pool = require("../models/pg_connector");

async function display_admin_page(req, res) {
    if (req.session.authented && req.session.role_id === 2) {
        let shop_id = 1;
        if (req.body.shops) {
            shop_id = parseInt(req.body.shops);
        }
        let table = await generate_table(shop_id);
        let dropdown_list = await generate_dropdown_list();
        res.render('admins', { 
            title: 'ADMIN PAGE',
            products_table: table,
            droplist: dropdown_list 
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
        table = `<table border=1><tr>`;
        
        // Generate header
        let col_list = [];
        for (let field of fields) {
            table += `<th>${field.name}</th>`;
            col_list.push(field.name);
        }
        table += `<th>Edit</th></tr>`; 

        // Generate rows
        for (let row of rows) {
            table += `<tr>`;
            for (let col of col_list) {
                let cell = row[col];
                table += `<td>${cell}</td>`;
            }

            table += `<td><a href="/admins/edit/${row.id}">Edit</a></td>`;
            table += `<td>
                          <form action="/admins/delete/${row.id}" method="POST" style="display:inline;">
                              <button type="submit" onclick="return confirm('Are you sure you want to delete this product?');">Delete</button>
                          </form>
                      </td>`;  
            table += `</tr>`;
        }
        table += `</table>`;
        
    } catch (err) {
        console.log(err);
        table = "Cannot connect to DB";
    }
    return table;
    
}


module.exports = display_admin_page;
