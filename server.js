
const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Logging middleware
app.use(morgan('dev'));

// Servir arquivos estáticos com cache adequado
app.use(express.static(__dirname, {
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      // Não fazer cache de arquivos HTML
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
      // Cache mais longo para recursos estáticos
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 dia
    }
  }
}));

// Rota principal redireciona para index.html
app.get('/', (req, res) => {
  res.redirect('/html/index.html');
});

// Todas as outras rotas não encontradas são redirecionadas para index.html
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    if (req.path.startsWith('/html/')) {
      // Tentar servir do diretório html
      res.sendFile(path.join(__dirname, req.path));
    } else {
      // Redirecionar para página principal
      res.redirect('/html/index.html');
    }
  } else {
    next();
  }
});

// Tratamento de erro
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).send('Erro no servidor');
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ KOT - Keep On Track - Servidor rodando na porta: ${PORT}`);
  console.log(`✅ Acesse: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co\n`);
});