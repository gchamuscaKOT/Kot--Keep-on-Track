
/**
 * Transações Financeiras - Javascript
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Configuração Global
  const cardColor = config.colors.cardColor;
  const headingColor = config.colors.headingColor;
  const labelColor = config.colors.textMuted;
  const borderColor = config.colors.borderColor;
  const primaryColor = config.colors.primary;
  const successColor = config.colors.success;
  const dangerColor = config.colors.danger;
  const warningColor = config.colors.warning;
  const infoColor = config.colors.info;

  // Definir o tema (necessário para resolver o erro isDarkStyle)
  const isDarkStyle = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Dados simulados de transações que seriam obtidos de um backend real
  const mockTransactionsData = {
    // Transações
    transactions: [
      {
        id: 1258,
        date: '2023-06-12',
        description: 'Pagamento de patrocínio - Empresa XYZ',
        category: 'Patrocínio',
        amount: 1200.00,
        status: 'Concluído',
        type: 'income',
        account: 'Banco Principal',
        notes: 'Campanha de marketing de junho'
      },
      {
        id: 1257,
        date: '2023-06-10',
        description: 'Equipamento de gravação - Câmera DSLR',
        category: 'Equipamento',
        amount: 750.00,
        status: 'Concluído',
        type: 'expense',
        account: 'Cartão de Crédito',
        notes: 'Upgrade para melhorar qualidade dos vídeos'
      },
      {
        id: 1256,
        date: '2023-06-08',
        description: 'Monetização YouTube',
        category: 'AdSense',
        amount: 850.75,
        status: 'Concluído',
        type: 'income',
        account: 'Banco Principal',
        notes: 'Pagamento referente a maio/2023'
      },
      {
        id: 1255,
        date: '2023-06-05',
        description: 'Software de edição - Adobe Creative Cloud',
        category: 'Software',
        amount: 129.99,
        status: 'Concluído',
        type: 'expense',
        account: 'Cartão de Crédito',
        notes: 'Assinatura mensal'
      },
      {
        id: 1254,
        date: '2023-06-01',
        description: 'Patrocínio Instagram - Marca ABC',
        category: 'Patrocínio',
        amount: 500.00,
        status: 'Concluído',
        type: 'income',
        account: 'Banco Principal',
        notes: 'Publicação patrocinada nos stories'
      },
      {
        id: 1253,
        date: '2023-05-28',
        description: 'Conta de Internet',
        category: 'Serviços',
        amount: 89.90,
        status: 'Concluído',
        type: 'expense',
        account: 'Débito Automático',
        notes: 'Internet de alta velocidade para streaming'
      },
      {
        id: 1252,
        date: '2023-05-25',
        description: 'Programa de Afiliados - Empresa DEF',
        category: 'Afiliados',
        amount: 320.50,
        status: 'Concluído',
        type: 'income',
        account: 'Banco Principal',
        notes: 'Comissões da segunda quinzena de maio'
      },
      {
        id: 1251,
        date: '2023-05-20',
        description: 'Microfone profissional',
        category: 'Equipamento',
        amount: 450.00,
        status: 'Concluído',
        type: 'expense',
        account: 'Cartão de Crédito',
        notes: 'Microfone condensador para melhorar qualidade de áudio'
      },
      {
        id: 1250,
        date: '2023-05-15',
        description: 'Monetização TikTok',
        category: 'Plataformas',
        amount: 425.30,
        status: 'Concluído',
        type: 'income',
        account: 'Banco Principal',
        notes: 'Pagamento de Creator Fund'
      },
      {
        id: 1249,
        date: '2023-05-10',
        description: 'Iluminação para estúdio',
        category: 'Equipamento',
        amount: 280.00,
        status: 'Concluído',
        type: 'expense',
        account: 'Cartão de Crédito',
        notes: 'Ring light e softbox'
      }
    ],
    
    // Categorias para formulário de transações
    categories: {
      income: ['AdSense', 'Patrocínio', 'Afiliados', 'Plataformas', 'Serviços', 'Vendas', 'Outros'],
      expense: ['Equipamento', 'Software', 'Serviços', 'Impostos', 'Marketing', 'Escritório', 'Outros']
    },
    
    // Contas bancárias
    accounts: ['Banco Principal', 'Cartão de Crédito', 'Poupança', 'Débito Automático', 'PayPal', 'Outro']
  };
  
  // Função para carregar dados - simulando conexão com backend
  const loadTransactionsData = async () => {
    try {
      // Em um ambiente real, aqui seria uma chamada fetch para o backend
      // const response = await fetch('/api/financial/transactions');
      // const data = await response.json();
      
      // Vamos simular uma resposta do backend usando os dados mocados
      return mockTransactionsData;
    } catch (error) {
      console.error('Erro ao carregar dados de transações:', error);
      return mockTransactionsData; // Usar dados simulados em caso de erro
    }
  };

  // Inicialização da página de transações
  const initTransactions = async () => {
    const data = await loadTransactionsData();
    renderTransactionsTable(data.transactions);
    setupTransactionForm(data);
  };

  // Renderiza a tabela de transações
  const renderTransactionsTable = (transactions) => {
    const tableBody = document.querySelector('#transactionsTable tbody');
    if (!tableBody) return;
    
    // Limpar tabela antes de adicionar novos dados
    tableBody.innerHTML = '';
    
    // Adicionar cada transação à tabela
    transactions.forEach(transaction => {
      const row = document.createElement('tr');
      
      // Determine o ícone com base no tipo de transação
      const iconClass = transaction.type === 'income' ? 
        'bx bx-trending-up text-success' : 'bx bx-trending-down text-danger';
      
      // Formatar a data para exibição
      const dateParts = transaction.date.split('-');
      const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      
      // Status badge class
      const statusClass = transaction.status === 'Concluído' ? 
        'badge bg-label-success' : 'badge bg-label-warning';
      
      // Valor formatado com R$
      const formattedAmount = `R$ ${transaction.amount.toFixed(2)}`;
      
      // Construir o conteúdo HTML da linha
      row.innerHTML = `
        <td><i class="${iconClass} me-1"></i> #${transaction.id}</td>
        <td>${formattedDate}</td>
        <td>${transaction.description}</td>
        <td>${transaction.category}</td>
        <td>${transaction.type === 'income' ? formattedAmount : `-${formattedAmount}`}</td>
        <td><span class="${statusClass} me-1">${transaction.status}</span></td>
        <td>
          <div class="dropdown">
            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
              <i class="bx bx-dots-vertical-rounded"></i>
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#transactionDetailsModal" data-transaction-id="${transaction.id}">
                <i class="bx bx-show-alt me-1"></i> Detalhes
              </a>
              <a class="dropdown-item" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#editTransactionModal" data-transaction-id="${transaction.id}">
                <i class="bx bx-edit-alt me-1"></i> Editar
              </a>
              <a class="dropdown-item" href="javascript:void(0);" onclick="confirmDeleteTransaction(${transaction.id})">
                <i class="bx bx-trash me-1"></i> Excluir
              </a>
            </div>
          </div>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Adicionar event listeners para os botões de detalhes e edição
    setupActionButtons(transactions);
  };

  // Configurar listeners para botões de ação na tabela
  const setupActionButtons = (transactions) => {
    // Listener para modal de detalhes
    document.querySelectorAll('[data-bs-target="#transactionDetailsModal"]').forEach(button => {
      button.addEventListener('click', function() {
        const transactionId = parseInt(this.dataset.transactionId);
        const transaction = transactions.find(t => t.id === transactionId);
        
        if (transaction) {
          // Preencher o modal com detalhes da transação
          const modal = document.getElementById('transactionDetailsModal');
          if (modal) {
            const typeIcon = transaction.type === 'income' ? 
              '<i class="bx bx-trending-up text-success fs-3 me-2"></i>' : 
              '<i class="bx bx-trending-down text-danger fs-3 me-2"></i>';
            
            const typeLabel = transaction.type === 'income' ? 'Receita' : 'Despesa';
            const dateParts = transaction.date.split('-');
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            
            // Atualizar conteúdo do modal
            modal.querySelector('.modal-title').innerHTML = `${typeIcon} ${transaction.description}`;
            
            const detailsContainer = modal.querySelector('.modal-body');
            detailsContainer.innerHTML = `
              <div class="transaction-details">
                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="fw-semibold">ID:</span>
                    <span>#${transaction.id}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="fw-semibold">Tipo:</span>
                    <span>${typeLabel}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="fw-semibold">Data:</span>
                    <span>${formattedDate}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="fw-semibold">Categoria:</span>
                    <span>${transaction.category}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="fw-semibold">Valor:</span>
                    <span class="${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
                      R$ ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="fw-semibold">Conta:</span>
                    <span>${transaction.account}</span>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="fw-semibold">Status:</span>
                    <span>
                      <span class="${transaction.status === 'Concluído' ? 'badge bg-label-success' : 'badge bg-label-warning'}">
                        ${transaction.status}
                      </span>
                    </span>
                  </div>
                </div>
                <div class="mb-0">
                  <div class="fw-semibold mb-1">Observações:</div>
                  <p class="mb-0">${transaction.notes || 'Nenhuma observação registrada.'}</p>
                </div>
              </div>
            `;
          }
        }
      });
    });
    
    // Listener para modal de edição
    document.querySelectorAll('[data-bs-target="#editTransactionModal"]').forEach(button => {
      button.addEventListener('click', function() {
        const transactionId = parseInt(this.dataset.transactionId);
        const transaction = transactions.find(t => t.id === transactionId);
        
        if (transaction) {
          // Preencher o formulário com os dados da transação
          const modal = document.getElementById('editTransactionModal');
          if (modal) {
            // TODO: Implementar preenchimento do formulário de edição
            console.log('Editar transação:', transaction);
          }
        }
      });
    });
  };

  // Configurar formulário de nova transação
  const setupTransactionForm = (data) => {
    const newTransactionForm = document.getElementById('newTransactionForm');
    const transactionTypeRadios = document.getElementsByName('transactionType');
    const categorySelect = document.getElementById('transactionCategory');
    
    if (!newTransactionForm || !categorySelect) return;
    
    // Adicionar event listener para alterar as categorias quando o tipo de transação mudar
    transactionTypeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        updateCategoryOptions(categorySelect, data.categories, this.value);
      });
    });
    
    // Inicializar categorias com base no tipo selecionado por padrão
    const defaultType = document.querySelector('input[name="transactionType"]:checked').value;
    updateCategoryOptions(categorySelect, data.categories, defaultType);
    
    // Preencher o select de contas
    const accountSelect = document.getElementById('transactionAccount');
    if (accountSelect) {
      accountSelect.innerHTML = '';
      data.accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account;
        option.textContent = account;
        accountSelect.appendChild(option);
      });
    }
    
    // Event listener para envio do formulário
    newTransactionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulação de envio ao backend
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...';
      
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Adicionar Transação';
        
        // Fechar modal e exibir mensagem de sucesso
        const modal = bootstrap.Modal.getInstance(document.getElementById('newTransactionModal'));
        modal.hide();
        
        // Exibir mensagem de sucesso
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade', 'show');
        alert.innerHTML = `
          <div>Transação adicionada com sucesso!</div>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        document.querySelector('.container-xxl').prepend(alert);
        
        // Limpar formulário
        newTransactionForm.reset();
        
        // Simular recarregamento de dados
        initTransactions();
      }, 1500);
    });
  };

  // Atualizar opções de categoria com base no tipo de transação
  const updateCategoryOptions = (selectElement, categories, type) => {
    if (!selectElement) return;
    
    // Limpar opções atuais
    selectElement.innerHTML = '';
    
    // Adicionar novas opções com base no tipo
    const categoryList = type === 'income' ? categories.income : categories.expense;
    categoryList.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      selectElement.appendChild(option);
    });
  };

  // Adicionar ao escopo global para uso em onclick
  window.confirmDeleteTransaction = function(transactionId) {
    if (confirm(`Tem certeza que deseja excluir a transação #${transactionId}?`)) {
      // Simulação de exclusão
      console.log('Excluindo transação:', transactionId);
      
      // Exibir mensagem de sucesso
      const alert = document.createElement('div');
      alert.classList.add('alert', 'alert-success', 'alert-dismissible', 'fade', 'show');
      alert.innerHTML = `
        <div>Transação #${transactionId} excluída com sucesso!</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      
      document.querySelector('.container-xxl').prepend(alert);
      
      // Recarregar dados
      initTransactions();
    }
  };

  // Inicializar a página
  initTransactions();
});
