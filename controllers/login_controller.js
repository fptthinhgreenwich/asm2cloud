const authenticator = require('./authen');

async function login_ctrl(req, res) {
  // Retrieve username and password from form
  let uname = req.body.username;
  let pword = req.body.password;
  let authented = false;

  console.log(`USERNAME: ${uname}`);
  console.log(`PASSWORD: ${pword}`);

  try {
    // Call authentication function to verify username, password
    const result = await authenticator(uname, pword);

    if (result.rowCount == 1) {
      authented = true;
      req.session.authented = authented;
      req.session.username = uname;

      // Save user role in session
      let role_id = result.rows[0].role_id;
      req.session.role_id = role_id;

      console.log(`ROLE_ID: ${role_id}`);
      console.log(`Authenticated: ${authented}`);

      // Redirect based on role_id
      if (role_id == 3) {
        res.redirect('/shopusers');
      } else if (role_id == 2) {
        res.redirect('/admins');
      } else if (role_id == 4) {
        res.redirect('/users');
      } else {
        // Fallback redirection for other roles
        res.redirect('/users');
      }
    } else {
      // If authentication fails, re-render the login page
      res.render('login', { title: 'LOGIN PAGE', message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).send('Internal Server Error');
  }

  return authented;
}

module.exports = login_ctrl;
