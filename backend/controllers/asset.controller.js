
const { supabaseClient } = require('../config/supabase.config');

/**
 * Obter todos os ativos do usuário
 */
const getAllAssets = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const { data, error } = await supabaseClient
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({ 
      assets: data 
    });
  } catch (error) {
    console.error('Erro ao buscar ativos:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Obter ativos por tipo (investment/property)
 */
const getAssetsByType = async (req, res) => {
  const { type } = req.params;
  const userId = req.user.id;
  
  if (type !== 'investment' && type !== 'property') {
    return res.status(400).json({ message: 'Tipo inválido. Use investment ou property.' });
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('assets')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .order('name');
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({ 
      assets: data 
    });
  } catch (error) {
    console.error('Erro ao buscar ativos por tipo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Obter resumo do patrimônio
 */
const getAssetSummary = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const { data: assets, error } = await supabaseClient
      .from('assets')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    // Calcular resumo
    const totalValue = assets.reduce((sum, asset) => sum + parseFloat(asset.value), 0);
    
    // Calcular por tipo
    const investmentValue = assets
      .filter(asset => asset.type === 'investment')
      .reduce((sum, asset) => sum + parseFloat(asset.value), 0);
    
    const propertyValue = assets
      .filter(asset => asset.type === 'property')
      .reduce((sum, asset) => sum + parseFloat(asset.value), 0);
    
    // Calcular retorno mensal total (apenas para investimentos)
    const monthlyReturn = assets
      .filter(asset => asset.type === 'investment' && asset.monthly_return)
      .reduce((sum, asset) => {
        const returnValue = (parseFloat(asset.value) * parseFloat(asset.monthly_return)) / 100;
        return sum + returnValue;
      }, 0);
    
    return res.status(200).json({
      summary: {
        total_value: totalValue,
        investment_value: investmentValue,
        property_value: propertyValue,
        monthly_return: monthlyReturn,
        asset_count: assets.length
      }
    });
  } catch (error) {
    console.error('Erro ao gerar resumo de patrimônio:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Obter um ativo específico
 */
const getAssetById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    const { data, error } = await supabaseClient
      .from('assets')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      return res.status(404).json({ message: 'Ativo não encontrado' });
    }
    
    return res.status(200).json({ 
      asset: data 
    });
  } catch (error) {
    console.error('Erro ao buscar ativo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Obter histórico de um ativo
 */
const getAssetHistory = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    // Verificar se o ativo pertence ao usuário
    const { data: asset, error: assetError } = await supabaseClient
      .from('assets')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (assetError || !asset) {
      return res.status(404).json({ message: 'Ativo não encontrado' });
    }
    
    // Buscar histórico do ativo
    const { data, error } = await supabaseClient
      .from('asset_history')
      .select('*')
      .eq('asset_id', id)
      .order('date', { ascending: false });
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({ 
      history: data 
    });
  } catch (error) {
    console.error('Erro ao buscar histórico de ativo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Criar um novo ativo
 */
const createAsset = async (req, res) => {
  const {
    name,
    type,
    value,
    acquisition_date,
    location,
    monthly_return,
    notes
  } = req.body;
  
  const userId = req.user.id;
  
  try {
    // Criar ativo
    const { data: newAsset, error } = await supabaseClient
      .from('assets')
      .insert({
        user_id: userId,
        name,
        type,
        value,
        acquisition_date,
        location,
        monthly_return,
        notes
      })
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    // Adicionar primeiro registro no histórico
    if (newAsset && newAsset[0]) {
      await supabaseClient
        .from('asset_history')
        .insert({
          asset_id: newAsset[0].id,
          date: newAsset[0].acquisition_date,
          value: newAsset[0].value,
          notes: 'Aquisição inicial'
        });
    }
    
    return res.status(201).json({
      message: 'Ativo criado com sucesso',
      asset: newAsset[0]
    });
  } catch (error) {
    console.error('Erro ao criar ativo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Adicionar registro de histórico a um ativo
 */
const addAssetHistoryRecord = async (req, res) => {
  const { id } = req.params;
  const { date, value, notes } = req.body;
  const userId = req.user.id;
  
  if (!date || !value) {
    return res.status(400).json({ message: 'Data e valor são obrigatórios' });
  }
  
  try {
    // Verificar se o ativo pertence ao usuário
    const { data: asset, error: assetError } = await supabaseClient
      .from('assets')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (assetError || !asset) {
      return res.status(404).json({ message: 'Ativo não encontrado' });
    }
    
    // Adicionar registro no histórico
    const { data, error } = await supabaseClient
      .from('asset_history')
      .insert({
        asset_id: id,
        date,
        value,
        notes
      })
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    // Atualizar valor atual do ativo
    await supabaseClient
      .from('assets')
      .update({
        value,
        updated_at: new Date()
      })
      .eq('id', id)
      .eq('user_id', userId);
    
    return res.status(201).json({
      message: 'Registro de histórico adicionado com sucesso',
      history_record: data[0]
    });
  } catch (error) {
    console.error('Erro ao adicionar registro de histórico:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Atualizar um ativo existente
 */
const updateAsset = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    type,
    value,
    acquisition_date,
    location,
    monthly_return,
    notes
  } = req.body;
  
  const userId = req.user.id;
  
  try {
    // Verificar se o ativo pertence ao usuário
    const { data: existingAsset, error: findError } = await supabaseClient
      .from('assets')
      .select('id, value')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (findError || !existingAsset) {
      return res.status(404).json({ message: 'Ativo não encontrado' });
    }
    
    // Atualizar ativo
    const { data, error } = await supabaseClient
      .from('assets')
      .update({
        name,
        type,
        value,
        acquisition_date,
        location,
        monthly_return,
        notes,
        updated_at: new Date()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    // Se o valor foi alterado, adicionar novo registro no histórico
    if (existingAsset.value !== value) {
      await supabaseClient
        .from('asset_history')
        .insert({
          asset_id: id,
          date: new Date(),
          value,
          notes: 'Atualização de valor'
        });
    }
    
    return res.status(200).json({
      message: 'Ativo atualizado com sucesso',
      asset: data[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar ativo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Excluir um ativo
 */
const deleteAsset = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    // Verificar se o ativo pertence ao usuário
    const { data: existingAsset, error: findError } = await supabaseClient
      .from('assets')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (findError || !existingAsset) {
      return res.status(404).json({ message: 'Ativo não encontrado' });
    }
    
    // Excluir histórico do ativo (os registros serão removidos pela constraint CASCADE)
    
    // Excluir o ativo
    const { error } = await supabaseClient
      .from('assets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({
      message: 'Ativo excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir ativo:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllAssets,
  getAssetsByType,
  getAssetSummary,
  getAssetById,
  getAssetHistory,
  createAsset,
  addAssetHistoryRecord,
  updateAsset,
  deleteAsset
};
