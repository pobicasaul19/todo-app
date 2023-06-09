import express from 'express'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import * as url from 'url';
import bcrypt from 'bcryptjs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express()
app.use(express.json())

const adapter = new JSONFile(__dirname + '/auth.json');
const db = new Low(adapter);
await db.read();
db.data ||= { users: [] }

const rpID = "localhost";
const protocol = "http";
const port = 5050;
const expectedOrigin = `${protocol}://${rpID}:${port}`;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

function findUser(email) {
  const results = db.data.users.filter(user => user.email === email);
  if (results.length === 0) return null;
  return results[0];
}

// ADD HERE THE REST OF THE ENDPOINTS

app.post("/auth/login", (req, res) => {
  const userFound = findUser(req.body.email);
  if (userFound) {
    // User Found, check password
    if (bcrypt.compareSync(req.body.password, userFound.password)) {
      res.send({ok: true, name: userFound.name, email: userFound.email});
    } else {
      // User Not Found
      res.send({ok: false, message: "Credentials not valid"});
    }
  } else {
    // User not found
    res.send({ok: false, message: "Credentials not valid"});
  }
  });
  
  app.post("/auth/register", (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(req.body.password, salt);
  
    // TODO: Data Validation
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPass
    }
    const userFound = findUser(user.email);
    if (userFound) {
      // User already exists
      res.send({ok: false, message: "User already exists"});
    } else {
      // User does not exist, create it
      db.data.users.push(user);
      db.write();
      res.send({ok: true});
    }
  });


app.get("*", (req, res) => {
    res.sendFile(__dirname + "index.html"); 
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});