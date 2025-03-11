
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Importando rotas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');
const categoryRoutes = require('./routes/category.routes');
const paymentMethodRoutes = require('./routes/payment.routes');
const assetRoutes = require('./routes/asset.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);
app.use('/api/assets', assetRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API está funcionando!' });
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ KOT - Keep On Track - Backend rodando na porta: ${PORT}`);
  console.log(`✅ API Disponível em: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api`);
});
