const mongoose = require('mongoose');

const MONGO_URI =
  'mongodb+srv://miguelfsa738_db_user:senhaforte123@miguel.minawmk.mongodb.net/cadastro?retryWrites=true&w=majority&appName=miguel';

async function connectDatabase() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB conectado com sucesso.');
  console.log('Banco conectado:', mongoose.connection.name);
}
module.exports = connectDatabase;