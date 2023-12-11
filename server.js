const express = require('express');
const expressFileUpload = require('express-fileupload');
const path = require('path');
const router = require("./routes/submit-routes");

const app = express();
const port = 3000;


const dB=require('./middlewares/DB');
dB.connectToDb();

app.use(expressFileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Use the router
app.use("/", router);

app.get('/', (req, res) => {
  res.render('index');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
