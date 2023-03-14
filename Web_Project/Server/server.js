const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;


// Define your MySQL database connection settings
const connection = mysql.createConnection({
    host: 'sql12.freemysqlhosting.net',
    user: 'sql12604850',
    password: 'Ak4kJd5HqR',
    database: 'sql12604850', // replace with your database name
    port: 3306,
    connectTimeout: 6000000
});

// Connect to the MySQL database
connection.connect((error) => {
    if (error) {
      console.error('Error connecting to the database: ' + error.stack);
      return;
    }
    console.log('Connected to the database as ID ' + connection.threadId);
});
  
app.use(express.json());

//app.use(require('./router/auth'));

app.get('/',(req,res)=>{
    res.send("Hello from server ");
})

const middleware =(req,res,next)=>{
    console.log('Hello middleware');
    next();
}
app.get('/api/users', async(req,res)=>{
  const sql = 'SELECT * FROM users';
  try {
    const result = await executeQuery(sql);
    res.send(result);
} catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
}
});

app.get('/api/users/:id', middleware, async (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM users WHERE id = ?';
  try {
      const result = await executeQuery(sql, [id]);
      res.send(result);
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password)
    {
        return res.status(422).json({error:"Please fill detail clearly"})
    }
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    try {
        await executeQuery(sql, [name, email, password]);
       
        const user = { name, email, password };
        res.send(user);
        console.log(name +"is inserted");
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.delete('/api/users/delete/', async (req, res) => {
   
    const name = req.body.name;
    const getIdSql = 'SELECT id FROM users WHERE name = ?';
    const deleteSql = 'DELETE FROM users WHERE id = ?';
    try {
      const result = await executeQuery(getIdSql, [name]);
      if (result.length === 0) {
        res.status(404).send({ error: 'User not found' });
        return;
      }
      const id = result[0].id;
      await executeQuery(deleteSql, [id]);
      res.send({ message: `User ${name} deleted successfully` });
      console.log(`User ${name} deleted successfully`);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
    
});

app.post('/api/users/update', async (req, res) => {
    const { email, password, newInfo } = req.body;
    
    // Fetch the user's id from the database based on their name and password
    const userQuery = 'SELECT id FROM users WHERE email = ? AND password = ?';
    const userResult = await executeQuery(userQuery, [email, password]);
    
    if (userResult.length === 0) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }
    
    const userId = userResult[0].id;
  
    // Update the user's information in the database
    const updateQuery = 'UPDATE users SET  email = ?, password = ? WHERE id = ?';
    const { newEmail, newPassword } = newInfo;
    await executeQuery(updateQuery, [newEmail, newPassword, userId]);
    
    res.send({ message: 'User information updated successfully' });
  });
 

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).send({ error: 'Missing email or password' });
    }
  
    const sql = 'SELECT * FROM users WHERE email = ?';
    const values = [email];
    console.log(sql, values);
  
    try {
      const userResult = await executeQuery(sql, values);
        console.log("email is : "+userResult[0].email +" and password is "+userResult[0].password);
      if (userResult.length === 0) {
        return res.status(401).send({ error: 'Invalid email or password' });
      }
      

        console.log(password,userResult[0].password);
      if (password!==userResult[0].password) {
        return res.status(401).send({ error: 'Invalid email or password' });
      }
      console.log("success");
     //res.status(200).send({ message: 'User logged in successsfully' });
     res.send(userResult);
      
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });
  
function clearForm() {
    setName('');
    setEmail('');
    setPassword('');
}

async function executeQuery(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
