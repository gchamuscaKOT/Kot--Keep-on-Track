
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');
const categoryRoutes = require('./routes/category.routes');
const channelRoutes = require('./routes/channel.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();

// Configurar middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Definir rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/tasks', taskRoutes);

// Rota básica
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Keep On Track' });
});

// Sincronizar com o banco de dados e iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
});
