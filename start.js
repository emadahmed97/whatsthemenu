const mongoose = require('mongoose');


require('dotenv').config({ path: 'variables.env' });


mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`${err.message}`);
});


require('./models/Store')
require('./models/User')
require('./models/ReviewStore')
require('./models/MenuItem')
require('./models/ReviewItem')

const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

require('./handlers/mail');
