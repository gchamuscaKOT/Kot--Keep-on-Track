
const { body, validationResult } = require("express-validator");

// Validação comum
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validação para registro de usuário
const validateSignUp = [
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('O nome de usuário deve ter entre 3 e 20 caracteres')
    .matches(/^[a-zA-Z0-9_\.]+$/)
    .withMessage('O nome de usuário só pode conter letras, números, pontos e sublinhados'),
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('A senha deve ter pelo menos 6 caracteres'),
  body('fullName')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('O nome completo deve ter entre 3 e 50 caracteres'),
  validate
];

// Validação para login
const validateSignIn = [
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  validate
];

// Validação para transações
const validateTransaction = [
  body('amount')
    .isNumeric()
    .withMessage('O valor deve ser numérico')
    .isFloat({ gt: 0 })
    .withMessage('O valor deve ser maior que zero'),
  body('description')
    .isLength({ min: 3, max: 100 })
    .withMessage('A descrição deve ter entre 3 e 100 caracteres'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('O tipo deve ser "income" ou "expense"'),
  body('date')
    .isDate()
    .withMessage('Data inválida'),
  body('categoryId')
    .notEmpty()
    .withMessage('Categoria é obrigatória'),
  validate
];

// Validação para categorias
const validateCategory = [
  body('name')
    .isLength({ min: 2, max: 30 })
    .withMessage('O nome deve ter entre 2 e 30 caracteres'),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('O tipo deve ser "income" ou "expense"'),
  body('color')
    .optional()
    .isHexColor()
    .withMessage('A cor deve ser um valor hexadecimal válido'),
  validate
];

// Validação para canais
const validateChannel = [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('O nome deve ter entre 2 e 50 caracteres'),
  body('type')
    .isIn(['youtube', 'instagram', 'tiktok', 'twitter', 'facebook', 'other'])
    .withMessage('Tipo de canal inválido'),
  body('url')
    .isURL()
    .withMessage('URL inválida'),
  body('subscribers')
    .optional()
    .isInt({ min: 0 })
    .withMessage('O número de inscritos deve ser um número inteiro não negativo'),
  body('monthlyViews')
    .optional()
    .isInt({ min: 0 })
    .withMessage('O número de visualizações mensais deve ser um número inteiro não negativo'),
  body('engagementRate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('A taxa de engajamento deve ser um número entre 0 e 100'),
  validate
];

// Validação para tarefas
const validateTask = [
  body('title')
    .isLength({ min: 3, max: 100 })
    .withMessage('O título deve ter entre 3 e 100 caracteres'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('A descrição deve ter no máximo 500 caracteres'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Data de vencimento inválida'),
  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('A prioridade deve ser "low", "medium" ou "high"'),
  body('status')
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('O status deve ser "pending", "in_progress", "completed" ou "cancelled"'),
  validate
];

module.exports = {
  validateSignUp,
  validateSignIn,
  validateTransaction,
  validateCategory,
  validateChannel,
  validateTask
};
/**
 * Middleware para validar dados de transações financeiras
 */
const validateTransaction = (req, res, next) => {
  const { date, description, amount, type, category_id } = req.body;

  // Validar campos obrigatórios
  if (!date || !amount || !type) {
    return res.status(400).json({ 
      message: 'Campos obrigatórios: data, valor e tipo da transação.' 
    });
  }

  // Validar tipo de transação
  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ 
      message: 'Tipo de transação deve ser "income" ou "expense".' 
    });
  }

  // Validar valor
  if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return res.status(400).json({ 
      message: 'O valor deve ser um número positivo.' 
    });
  }

  next();
};

/**
 * Middleware para validar dados de categorias
 */
const validateCategory = (req, res, next) => {
  const { name, type, color, icon } = req.body;

  // Validar campos obrigatórios
  if (!name || !type || !color || !icon) {
    return res.status(400).json({ 
      message: 'Campos obrigatórios: nome, tipo, cor e ícone.' 
    });
  }

  // Validar tipo de categoria
  if (type !== 'income' && type !== 'expense') {
    return res.status(400).json({ 
      message: 'Tipo de categoria deve ser "income" ou "expense".' 
    });
  }

  next();
};

/**
 * Middleware para validar dados de métodos de pagamento
 */
const validatePaymentMethod = (req, res, next) => {
  const { name, icon } = req.body;

  // Validar campos obrigatórios
  if (!name || !icon) {
    return res.status(400).json({ 
      message: 'Campos obrigatórios: nome e ícone.' 
    });
  }

  next();
};

/**
 * Middleware para validar dados de ativos
 */
const validateAsset = (req, res, next) => {
  const { name, type, value, acquisition_date } = req.body;

  // Validar campos obrigatórios
  if (!name || !type || !value || !acquisition_date) {
    return res.status(400).json({ 
      message: 'Campos obrigatórios: nome, tipo, valor e data de aquisição.' 
    });
  }

  // Validar tipo de ativo
  if (type !== 'investment' && type !== 'property') {
    return res.status(400).json({ 
      message: 'Tipo de ativo deve ser "investment" ou "property".' 
    });
  }

  // Validar valor
  if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
    return res.status(400).json({ 
      message: 'O valor deve ser um número positivo.' 
    });
  }

  next();
};

module.exports = {
  validateTransaction,
  validateCategory,
  validatePaymentMethod,
  validateAsset
};
