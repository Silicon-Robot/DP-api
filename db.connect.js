const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('connected successfully'))
  .catch(() => console.log('connection failed'));

module.exports = mongoose;