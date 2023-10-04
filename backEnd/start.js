// load DB connection
require('./models/db');
const express = require('express');
const app = express();
const cors = require('cors');
bodyParser = require('body-parser');

// instruct express to use our routes middleware
app.use(require('./routes/routes'));
app.use(cors())

app.get("/api", (req, res) => {
    res.json({message: "Hello from server!"});
});

app.use(bodyParser.json());


app.listen(3001, () => {
    console.log('Serveur en cours d\'exécution sur le port 3001');
});

//app.listen(3001);

