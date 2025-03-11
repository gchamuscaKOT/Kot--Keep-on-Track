
const { supabaseClient } = require('../config/supabase.config');

/**
 * Obter todos os métodos de pagamento do usuário
 */
const getAllPaymentMethods = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const { data, error } = await supabaseClient
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('name');
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({ 
      payment_methods: data 
    });
  } catch (error) {
    console.error('Erro ao buscar métodos de pagamento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Obter um método de pagamento específico
 */
const getPaymentMethodById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    const { data, error } = await supabaseClient
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      return res.status(404).json({ message: 'Método de pagamento não encontrado' });
    }
    
    return res.status(200).json({ 
      payment_method: data 
    });
  } catch (error) {
    console.error('Erro ao buscar método de pagamento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Criar um novo método de pagamento
 */
const createPaymentMethod = async (req, res) => {
  const { name, icon } = req.body;
  const userId = req.user.id;
  
  try {
    // Verificar se já existe um método com o mesmo nome
    const { data: existing, error: existingError } = await supabaseClient
      .from('payment_methods')
      .select('id')
      .eq('user_id', userId)
      .eq('name', name);
    
    if (!existingError && existing.length > 0) {
      return res.status(400).json({ message: 'Já existe um método de pagamento com este nome' });
    }
    
    // Criar método de pagamento
    const { data, error } = await supabaseClient
      .from('payment_methods')
      .insert({
        user_id: userId,
        name,
        icon,
        is_default: false
      })
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(201).json({
      message: 'Método de pagamento criado com sucesso',
      payment_method: data[0]
    });
  } catch (error) {
    console.error('Erro ao criar método de pagamento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Atualizar um método de pagamento existente
 */
const updatePaymentMethod = async (req, res) => {
  const { id } = req.params;
  const { name, icon } = req.body;
  const userId = req.user.id;
  
  try {
    // Verificar se o método existe e pertence ao usuário
    const { data: existingMethod, error: findError } = await supabaseClient
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (findError || !existingMethod) {
      return res.status(404).json({ message: 'Método de pagamento não encontrado' });
    }
    
    // Não permitir alteração de métodos padrão
    if (existingMethod.is_default) {
      return res.status(403).json({ message: 'Métodos de pagamento padrão não podem ser modificados' });
    }
    
    // Verificar duplicidade com outro método (exceto o atual)
    const { data: duplicate, error: duplicateError } = await supabaseClient
      .from('payment_methods')
      .select('id')
      .eq('user_id', userId)
      .eq('name', name)
      .neq('id', id);
    
    if (!duplicateError && duplicate.length > 0) {
      return res.status(400).json({ message: 'Já existe outro método de pagamento com este nome' });
    }
    
    // Atualizar método de pagamento
    const { data, error } = await supabaseClient
      .from('payment_methods')
      .update({
        name,
        icon
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({
      message: 'Método de pagamento atualizado com sucesso',
      payment_method: data[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar método de pagamento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

/**
 * Excluir um método de pagamento
 */
const deletePaymentMethod = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    // Verificar se o método existe e pertence ao usuário
    const { data: existingMethod, error: findError } = await supabaseClient
      .from('payment_methods')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (findError || !existingMethod) {
      return res.status(404).json({ message: 'Método de pagamento não encontrado' });
    }
    
    // Não permitir exclusão de métodos padrão
    if (existingMethod.is_default) {
      return res.status(403).json({ message: 'Métodos de pagamento padrão não podem ser excluídos' });
    }
    
    // Verificar se existem transações usando este método
    const { data: relatedTransactions, error: relatedError } = await supabaseClient
      .from('financial_transactions')
      .select('id')
      .eq('payment_method_id', id)
      .eq('user_id', userId);
    
    if (!relatedError && relatedTransactions.length > 0) {
      return res.status(400).json({ 
        message: 'Este método de pagamento não pode ser excluído porque está sendo usado em transações' 
      });
    }
    
    // Excluir método de pagamento
    const { error } = await supabaseClient
      .from('payment_methods')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(200).json({
      message: 'Método de pagamento excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir método de pagamento:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
};
