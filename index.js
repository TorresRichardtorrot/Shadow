require('dotenv').config();
const app = require('./app.js');
require('./src/index.js')
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');

app.use(cors());


server.listen(process.env.PORT, () => {
  console.log('*** servidor activo ***');
});



