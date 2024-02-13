require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

let db;
let port = process.env.PORT || 3014;
let pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

const initializeDBAndServer = async () => {
  try {
    db = await pool.connect();
    await db.query(`
        CREATE TABLE IF NOT EXISTS finance_user (
            id SERIAL PRIMARY KEY, 
            username VARCHAR(50) UNIQUE, 
            password TEXT
        ) ;        
    `);
    // await db.query("drop table IF EXISTS user_expenses");
    await db.query(`
        CREATE TABLE IF NOT EXISTS user_expenses (
            id SERIAL PRIMARY KEY, 
            title VARCHAR(80),
            category VARCHAR(50) DEFAULT 'EXPENSES' , 
            transaction_date TEXT, 
            amount BIGINT, 
            user_id INT NOT NULL, 
            FOREIGN KEY(user_id) REFERENCES finance_user(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `);
    app.listen(port, () => console.log(`Server is running on Port: ${port}`));
  } catch (error) {
    console.log(`Error in intitailzing the database ${error.message}`);
  }
};

initializeDBAndServer();

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req?.body || {};
    if (!username || !password)
      res.send({ msg: "username or password cannot be empty" });

    const getUserQuery = `
            SELECT * FROM finance_user
            WHERE username = '${username}' ;
        `;
    const user = await db.query(getUserQuery);
    if (user.rows.length !== 0)
      return res.status(400).json({ msg: "Username already exists" });
    if (password.length < 6)
      return res.status(400).json({ msg: "Password is too short" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUserQuery = `
        INSERT INTO finance_user 
            (username, password) 
        VALUES 
            ('${username}', '${hashedPassword}') ;
    `;
    const dbResponse = await db.query(createUserQuery);
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: `Internal Server Error ${error.message}` });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ msg: "username or password cannot be empty" });

    const getUserQuery = `
            SELECT * FROM finance_user
            WHERE username = '${username}' ;
        `;
    const user = await db.query(getUserQuery);
    console.log(user.rows);
    if (user.rows.length === 0)
      return res.status(400).json({ msg: "User doesn't exists" });
    const isPasswordMatched = await bcrypt.compare(
      password,
      user.rows[0]?.password
    );
    if (!isPasswordMatched)
      return res.status(401).json({ msg: "Invalid Credentials Password" });
    const payload = {
      userId: user.rows[0]?.id,
      username,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    res.status(200).json({ jwt_token: token });
  } catch (error) {
    res.status(500).json({ msg: `Internal Server Error ${error.message}` });
  }
});

const verifyJwtToken = async (req, res, next) => {
  try {
    const authorization = req.headers?.authorization;
    if (!authorization)
      return res.status(401).json({ msg: "Token not available" });
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (error, payload) => {
      if (error) return res.status(401).json({ msg: "Invalid Token" });
      console.log(payload);
      req.user = payload;
      next();
    });
    console.log();
  } catch (error) {
    res.status(500).json({ msg: `Internal Server Error ${error.message}` });
  }
};

app.get("/transaction", verifyJwtToken, async (req, res) => {
  try {
    console.log(req.user);
    const query = `
        SELECT * FROM user_expenses WHERE user_id = ${req.user.userId} ;
    `;
    const dbResponse = await db.query(query);
    res.status(200).json({ msg: dbResponse.rows });
  } catch (error) {
    res.status(500).json({ msg: `Internal Server Error ${error.message}` });
  }
});

app.post("/", verifyJwtToken, async (req, res) => {
  try {
    const { category, amount, title } = req.body;
    const { userId } = req.user;
    const date = new Date();
    console.log(date.toString());
    const createTransactionQuery = `
        INSERT INTO user_expenses 
            (category, amount, user_id, title, transaction_date)
        VALUES 
            ('${category}', ${amount}, ${userId}, '${title}', '${date}')
    `;
    await db.query(createTransactionQuery);
    res.status(201).json({ msg: "Created Successfully" });
  } catch (error) {
    res.status(500).json({ msg: `Internal Server Error ${error.message}` });
  }
});

app.patch("/", verifyJwtToken, async (req, res) => {
  try {
    const { amount, category, tId } = req.body;
    const { userId } = req;

    const updateTransactionQuery = `
        UPDATE user_expenses 
        SET
            category = '${category}', amount = ${amount}
        WHERE id = ${tId} ;
    `;
    await db.query(updateTransactionQuery);
    res.status(201).json({ msg: "Updated Successfully" });
  } catch (error) {
    res.status(500).json({ msg: `Internal Server Error ${error.message}` });
  }
});

app.delete("/", verifyJwtToken, async (req, res) => {
  try {
    const { tId } = req.body;

    const updateTransactionQuery = `
          DELETE FROM user_expenses           
          WHERE id = ${tId} ;
      `;
    await db.query(updateTransactionQuery);
    res.status(201).json({ msg: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ msg: `Internal Server Error ${error.message}` });
  }
});

app.get("/get-user-data", verifyJwtToken, async (req, res) => {
  try {
    console.log(req.user);
    res.status(200).json({ msg: { username: req.user?.username } });
  } catch (error) {
    res.status(500).json({ msg: `Internal Server Error ${error.message}` });
  }
});
