
const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateAsset } = require('../middlewares/validation.middleware');

// Todas as rotas exigem autenticação
router.use(authenticate);

// Rota para obter todos os ativos
router.get('/', assetController.getAllAssets);

// Rota para obter ativos por tipo
router.get('/type/:type', assetController.getAssetsByType);

// Rota para obter resumo do patrimônio
router.get('/summary', assetController.getAssetSummary);

// Rota para obter um ativo específico
router.get('/:id', assetController.getAssetById);

// Rota para obter histórico de um ativo
router.get('/:id/history', assetController.getAssetHistory);

// Rota para criar um novo ativo
router.post('/', validateAsset, assetController.createAsset);

// Rota para adicionar registro de histórico a um ativo
router.post('/:id/history', assetController.addAssetHistoryRecord);

// Rota para atualizar um ativo
router.put('/:id', validateAsset, assetController.updateAsset);

// Rota para excluir um ativo
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
