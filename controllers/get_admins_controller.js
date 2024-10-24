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

        // Thêm class vào table và thẻ liên quan
        table = `<table class="admin-table"><thead><tr>`;
        
        // Generate header
        let col_list = [];
        for (let field of fields) {
            table += `<th class="table-header">${field.name}</th>`;
            col_list.push(field.name);
        }
        table += `</tr></thead><tbody>`;  // Thêm class cho body

        // Generate rows
        for (let row of rows) {
            table += `<tr class="table-row">`;
            for (let col of col_list) {
                let cell = row[col];
                table += `<td class="table-cell">${cell}</td>`;
            }
            table += `</tr>`;
        }
        table += `</tbody></table>`;
        
    } catch (err) {
        console.log(err);
        table = "Cannot connect to DB";
    }
    return table;
}

async function generate_dropdown_list() {
    let dropdown_list = "";
    try {
        const query = `SELECT id, shop_name FROM shops;`;
        const result = await pool.query(query);
        const rows = result.rows;

        dropdown_list = `
        <form action="" method="post" class="dropdown-form">
            <label for="shop" class="dropdown-label">Choose a shop ID:</label>
            <select name="shops" id="shop_id" class="dropdown-select">
                <option value=1>All shops</option>`;
        for (let row of rows) {
            if (row.id > 1) {
                dropdown_list += `<option value=${row.id}>${row.shop_name}</option>`;
            }
        }
        dropdown_list += `</select>
            <button type="submit" class="btn btn-select">Select</button>
        </form>`;
    } catch (err) {
        console.log(err);
        dropdown_list = "Cannot connect to DB";
    }
    return dropdown_list;
}

module.exports = display_admin_page;
