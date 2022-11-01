const mongoose = require('mongoose');
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATA_BASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connected successfully');
  });

const port = process.env.PORT || 4000;
const serer = app.listen(port, () => {
  console.log(`app listen on port ${port} `);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  serer.close(() => {
    process.exit(1);
  });
});


