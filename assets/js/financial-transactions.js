
/**
 * Página de Transações Financeiras
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Variáveis globais
  let currentPage = 1;
  const itemsPerPage = 10;
  let totalItems = 25; // Número total de itens para simulação
  let currentFilters = {};
  let transactions = []; // Armazenar todas as transações
  let sortField = 'date'; // Campo padrão para ordenação
  let sortDirection = 'desc'; // Direção padrão da ordenação (decrescente)

  // Dados de demonstração para transações
  const demoTransactions = [
    {
      id: 1258,
      date: '2023-06-12',
      description: 'Pagamento de patrocínio',
      category: 'Patrocínio',
      category_type: 'income',
      channel: 'Instagram',
      amount: 1200.00,
      status: 'Concluído'
    },
    {
      id: 1257,
      date: '2023-06-10',
      description: 'Equipamento de gravação',
      category: 'Equipamento',
      category_type: 'expense',
      channel: 'YouTube',
      amount: 750.00,
      status: 'Concluído'
    },
    {
      id: 1256,
      date: '2023-06-08',
      description: 'Monetização YouTube',
      category: 'AdSense',
      category_type: 'income',
      channel: 'YouTube',
      amount: 850.75,
      status: 'Concluído'
    },
    {
      id: 1255,
      date: '2023-06-05',
      description: 'Software de edição',
      category: 'Software',
      category_type: 'expense',
      channel: null,
      amount: 129.99,
      status: 'Concluído'
    },
    {
      id: 1254,
      date: '2023-06-01',
      description: 'Patrocínio Instagram',
      category: 'Patrocínio',
      category_type: 'income',
      channel: 'Instagram',
      amount: 500.00,
      status: 'Concluído'
    },
    // Dados adicionais para demonstração
    {
      id: 1253,
      date: '2023-05-28',
      description: 'Curso de edição de vídeo',
      category: 'Educação',
      category_type: 'expense',
      channel: null,
      amount: 450.00,
      status: 'Concluído'
    },
    {
      id: 1252,
      date: '2023-05-25',
      description: 'Monetização TikTok',
      category: 'AdSense',
      category_type: 'income',
      channel: 'TikTok',
      amount: 320.50,
      status: 'Concluído'
    },
    {
      id: 1251,
      date: '2023-05-20',
      description: 'Marketing e promoção',
      category: 'Marketing',
      category_type: 'expense',
      channel: 'Instagram',
      amount: 280.00,
      status: 'Concluído'
    },
    {
      id: 1250,
      date: '2023-05-18',
      description: 'Venda de produto digital',
      category: 'Venda Direta',
      category_type: 'income',
      channel: null,
      amount: 899.90,
      status: 'Concluído'
    },
    {
      id: 1249,
      date: '2023-05-15',
      description: 'Iluminação para estúdio',
      category: 'Equipamento',
      category_type: 'expense',
      channel: 'YouTube',
      amount: 650.00,
      status: 'Concluído'
    }
  ];

  // Função para carregar categorias
  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }
      
      const data = await response.json();
      populateCategoryDropdowns(data.categories);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      // Usar dados estáticos se a API falhar
      useDemoCategories();
    }
  };

  // Função para preencher dropdowns de categorias
  const populateCategoryDropdowns = (categories) => {
    const transactionCategorySelect = document.getElementById('transactionCategory');
    const filterCategorySelect = document.getElementById('filterCategory');
    
    if (transactionCategorySelect) {
      // Limpar opções anteriores, mantendo os optgroups
      const incomeOptgroup = transactionCategorySelect.querySelector('optgroup[label="Receitas"]');
      const expenseOptgroup = transactionCategorySelect.querySelector('optgroup[label="Despesas"]');
      
      if (incomeOptgroup && expenseOptgroup) {
        incomeOptgroup.innerHTML = '';
        expenseOptgroup.innerHTML = '';
        
        // Adicionar categorias nos optgroups
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id || category.value;
          option.textContent = category.name || category.label;
          
          if (category.type === 'income') {
            incomeOptgroup.appendChild(option);
          } else {
            expenseOptgroup.appendChild(option);
          }
        });
      }
    }
    
    if (filterCategorySelect) {
      // Para o filtro, mantenha a opção "Todas"
      const allOption = filterCategorySelect.querySelector('option[value=""]');
      filterCategorySelect.innerHTML = '';
      if (allOption) filterCategorySelect.appendChild(allOption);
      
      // Adicione as categorias
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id || category.value;
        option.textContent = category.name || category.label;
        filterCategorySelect.appendChild(option);
      });
    }
  };

  // Função para usar categorias de demonstração
  const useDemoCategories = () => {
    const demoCategories = [
      { id: 'adsense', name: 'AdSense', type: 'income' },
      { id: 'sponsorship', name: 'Patrocínio', type: 'income' },
      { id: 'affiliate', name: 'Programa de Afiliados', type: 'income' },
      { id: 'direct_sale', name: 'Venda Direta', type: 'income' },
      { id: 'equipment', name: 'Equipamento', type: 'expense' },
      { id: 'software', name: 'Software', type: 'expense' },
      { id: 'services', name: 'Serviços', type: 'expense' },
      { id: 'tax', name: 'Impostos', type: 'expense' }
    ];
    
    populateCategoryDropdowns(demoCategories);
  };

  // Carregar e exibir transações
  const loadTransactions = async () => {
    try {
      // Em um ambiente real, você buscaria as transações da API
      // const response = await fetch('/api/transactions?page=${currentPage}');
      // if (!response.ok) throw new Error('Erro ao carregar transações');
      // const data = await response.json();
      // transactions = data.transactions;
      // totalItems = data.total;
      
      // Para demonstração, usamos dados estáticos
      transactions = [...demoTransactions];
      totalItems = transactions.length;
      
      // Aplicar filtragem
      if (currentFilters.type) {
        transactions = transactions.filter(t => t.category_type === currentFilters.type);
      }
      
      if (currentFilters.category) {
        transactions = transactions.filter(t => t.category === currentFilters.category);
      }
      
      if (currentFilters.dateFrom) {
        const fromDate = new Date(currentFilters.dateFrom);
        transactions = transactions.filter(t => new Date(t.date) >= fromDate);
      }
      
      if (currentFilters.dateTo) {
        const toDate = new Date(currentFilters.dateTo);
        transactions = transactions.filter(t => new Date(t.date) <= toDate);
      }
      
      // Aplicar ordenação
      sortTransactions();
      
      // Aplicar paginação
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedTransactions = transactions.slice(start, end);
      
      // Atualizar a tabela
      updateTransactionTable(paginatedTransactions);
      
      // Atualizar paginação
      updatePagination();
      
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      // Usar dados de demonstração em caso de erro
      transactions = [...demoTransactions];
      updateTransactionTable(transactions.slice(0, itemsPerPage));
      updatePagination();
    }
  };

  // Ordenar transações
  const sortTransactions = () => {
    transactions.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      
      // Inverter se for ordenação decrescente
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  };

  // Atualizar a tabela de transações
  const updateTransactionTable = (transactionsToShow) => {
    const tableBody = document.querySelector('table tbody');
    if (!tableBody) return;
    
    // Limpar tabela
    tableBody.innerHTML = '';
    
    // Adicionar linhas
    transactionsToShow.forEach(transaction => {
      const row = document.createElement('tr');
      
      // Formatação da data
      const date = new Date(transaction.date);
      const formattedDate = date.toLocaleDateString('pt-BR');
      
      // Ícone e classe com base no tipo
      const isIncome = transaction.category_type === 'income';
      const typeIconClass = isIncome ? 'bx bx-trending-up text-success' : 'bx bx-trending-down text-danger';
      const amountClass = isIncome ? 'text-success' : 'text-danger';
      
      // Determinar o ícone do canal
      let channelIcon = '';
      if (transaction.channel) {
        if (transaction.channel === 'YouTube') {
          channelIcon = '<i class="bx bxl-youtube text-danger"></i>';
        } else if (transaction.channel === 'Instagram') {
          channelIcon = '<i class="bx bxl-instagram text-danger"></i>';
        } else if (transaction.channel === 'TikTok') {
          channelIcon = '<i class="bx bxl-tiktok text-dark"></i>';
        }
      }
      
      // Cor da badge da categoria
      let categoryBadgeClass = 'bg-label-primary';
      if (transaction.category === 'Equipamento' || transaction.category === 'Hardware') {
        categoryBadgeClass = 'bg-label-danger';
      } else if (transaction.category === 'Software') {
        categoryBadgeClass = 'bg-label-warning';
      } else if (transaction.category === 'AdSense') {
        categoryBadgeClass = 'bg-label-success';
      }
      
      row.innerHTML = `
        <td><i class="${typeIconClass} me-1"></i> #${transaction.id}</td>
        <td>${formattedDate}</td>
        <td>${transaction.description}</td>
        <td><span class="badge ${categoryBadgeClass}">${transaction.category}</span></td>
        <td>${transaction.channel ? channelIcon + ' ' + transaction.channel : '-'}</td>
        <td><strong class="${amountClass}">R$ ${transaction.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong></td>
        <td><span class="badge bg-label-success me-1">${transaction.status}</span></td>
        <td>
          <div class="dropdown">
            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
              <i class="bx bx-dots-vertical-rounded"></i>
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="javascript:void(0);" onclick="editTransaction(${transaction.id})"><i class="bx bx-edit-alt me-1"></i> Editar</a>
              <a class="dropdown-item" href="javascript:void(0);" onclick="deleteTransaction(${transaction.id})"><i class="bx bx-trash me-1"></i> Excluir</a>
              <a class="dropdown-item" href="javascript:void(0);" onclick="viewReceipt(${transaction.id})"><i class="bx bx-file me-1"></i> Ver Comprovante</a>
            </div>
          </div>
        </td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Atualizar contador de resultados
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + transactionsToShow.length - 1, totalItems);
    document.querySelector('.d-flex.align-items-center span').textContent = `Mostrando ${start}-${end} de ${totalItems} itens`;
  };

  // Atualizar a paginação
  const updatePagination = () => {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    // Calcular total de páginas
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Limpar paginação anterior
    pagination.innerHTML = '';
    
    // Botão para página anterior
    const prevBtn = document.createElement('li');
    prevBtn.className = 'page-item prev' + (currentPage === 1 ? ' disabled' : '');
    prevBtn.innerHTML = '<a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevrons-left"></i></a>';
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        loadTransactions();
      }
    });
    pagination.appendChild(prevBtn);
    
    // Adicionar páginas
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement('li');
      pageItem.className = 'page-item' + (i === currentPage ? ' active' : '');
      pageItem.innerHTML = `<a class="page-link" href="javascript:void(0);">${i}</a>`;
      pageItem.addEventListener('click', () => {
        currentPage = i;
        loadTransactions();
      });
      pagination.appendChild(pageItem);
    }
    
    // Botão para próxima página
    const nextBtn = document.createElement('li');
    nextBtn.className = 'page-item next' + (currentPage === totalPages ? ' disabled' : '');
    nextBtn.innerHTML = '<a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevrons-right"></i></a>';
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        loadTransactions();
      }
    });
    pagination.appendChild(nextBtn);
  };

  // Configurar eventos de formulário
  const setupFormEvents = () => {
    // Formulário de Nova Transação
    const formNewTransaction = document.getElementById('formNewTransaction');
    if (formNewTransaction) {
      formNewTransaction.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Em um ambiente real, enviaria os dados para o backend
        // const formData = new FormData(this);
        // fetch('/api/transactions', {
        //   method: 'POST',
        //   body: formData
        // }).then(...);
        
        // Simulação de sucesso
        alert('Transação salva com sucesso!');
        this.reset();
        
        // Adicionar a nova transação ao início da lista (simulação)
        const newTransaction = {
          id: 1259, // Próximo ID
          date: document.getElementById('transactionDate').value,
          description: document.getElementById('transactionDescription').value,
          category: document.getElementById('transactionCategory').options[document.getElementById('transactionCategory').selectedIndex].text,
          category_type: document.getElementById('transactionType').value,
          channel: document.getElementById('youtube').checked ? 'YouTube' : 
                  document.getElementById('instagram').checked ? 'Instagram' : 
                  document.getElementById('tiktok').checked ? 'TikTok' : null,
          amount: parseFloat(document.getElementById('transactionAmount').value),
          status: 'Concluído'
        };
        
        demoTransactions.unshift(newTransaction);
        totalItems++;
        
        // Atualizar lista
        loadTransactions();
        
        // Fechar o formulário após salvar
        const bsCollapse = new bootstrap.Collapse(document.getElementById('collapseExample'), {
          toggle: false
        });
        bsCollapse.hide();
      });
    }

    // Formulário de Filtros
    const filterTransactions = document.getElementById('filterTransactions');
    if (filterTransactions) {
      filterTransactions.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coletar filtros
        currentFilters = {
          type: document.getElementById('filterType').value,
          category: document.getElementById('filterCategory').value,
          dateFrom: document.getElementById('filterDateFrom').value,
          dateTo: document.getElementById('filterDateTo').value
        };
        
        // Resetar paginação ao filtrar
        currentPage = 1;
        
        // Carregar transações com filtros
        loadTransactions();
      });
      
      // Resetar filtros
      filterTransactions.addEventListener('reset', function() {
        setTimeout(() => {
          currentFilters = {};
          currentPage = 1;
          loadTransactions();
        }, 10);
      });
    }

    // Seletor de itens por página
    const itemsPerPageSelect = document.querySelector('.d-flex.align-items-center select');
    if (itemsPerPageSelect) {
      itemsPerPageSelect.addEventListener('change', function() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1;
        loadTransactions();
      });
    }

    // Configurar opções de ordenação
    const sortOptions = document.querySelectorAll('.dropdown-item[href="javascript:void(0);"]');
    sortOptions.forEach(option => {
      option.addEventListener('click', function() {
        // Identificar opção de ordenação
        const text = this.textContent.trim();
        
        if (text === 'Data (recente)') {
          sortField = 'date';
          sortDirection = 'desc';
        } else if (text === 'Data (antiga)') {
          sortField = 'date';
          sortDirection = 'asc';
        } else if (text === 'Valor (maior)') {
          sortField = 'amount';
          sortDirection = 'desc';
        } else if (text === 'Valor (menor)') {
          sortField = 'amount';
          sortDirection = 'asc';
        } else if (text === 'Categoria (A-Z)') {
          sortField = 'category';
          sortDirection = 'asc';
        }
        
        // Atualizar o texto do botão de ordenação
        document.querySelector('.btn-outline-primary').innerHTML = 
          `<i class="bx bx-filter me-1"></i> Ordenar por: ${text}`;
        
        // Recarregar transações com nova ordenação
        loadTransactions();
      });
    });
  };

  // Funções para ações nas transações (globais para uso nos eventos inline)
  window.editTransaction = function(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    alert(`Editar transação: ${transaction.description}`);
    // Aqui você abriria um modal com os dados para edição
  };

  window.deleteTransaction = function(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      // Em ambiente real, enviar requisição para excluir
      // fetch(`/api/transactions/${id}`, { method: 'DELETE' }).then(...);
      
      // Simulação de exclusão
      const index = demoTransactions.findIndex(t => t.id === id);
      if (index !== -1) {
        demoTransactions.splice(index, 1);
        totalItems--;
        loadTransactions();
      }
    }
  };

  window.viewReceipt = function(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    alert(`Visualizando comprovante da transação: ${transaction.description}`);
    // Aqui você abriria um modal com a imagem do comprovante
  };

  // Inicializar a página
  const init = () => {
    // Carregar categorias
    loadCategories();
    
    // Configurar eventos
    setupFormEvents();
    
    // Carregar transações iniciais
    loadTransactions();
  };

  // Executar inicialização
  init();
    }
  };

  // Preencher as dropdowns de categorias
  const populateCategoryDropdowns = (categories) => {
    const transactionCategory = document.getElementById('transactionCategory');
    const filterCategory = document.getElementById('filterCategory');
    
    if (!categories || categories.length === 0) return;
    
    if (transactionCategory) {
      // Limpar opções existentes (mantendo a primeira)
      transactionCategory.innerHTML = '<option value="">Selecione...</option>';
      
      // Agrupar por tipo
      const incomeCategories = categories.filter(cat => cat.type === 'income');
      const expenseCategories = categories.filter(cat => cat.type === 'expense');
      
      // Adicionar grupo de receitas
      const incomeGroup = document.createElement('optgroup');
      incomeGroup.label = 'Receitas';
      incomeCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        incomeGroup.appendChild(option);
      });
      transactionCategory.appendChild(incomeGroup);
      
      // Adicionar grupo de despesas
      const expenseGroup = document.createElement('optgroup');
      expenseGroup.label = 'Despesas';
      expenseCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        expenseGroup.appendChild(option);
      });
      transactionCategory.appendChild(expenseGroup);
    }
    
    if (filterCategory) {
      // Limpar opções existentes (mantendo a primeira)
      filterCategory.innerHTML = '<option value="">Todas</option>';
      
      // Adicionar todas as categorias
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        filterCategory.appendChild(option);
      });
    }
  };

  // Usar categorias de demonstração
  const useDemoCategories = () => {
    const demoCategories = [
      { id: '1', name: 'AdSense', type: 'income', color: '#28a745', icon: 'bx-dollar' },
      { id: '2', name: 'Patrocínio', type: 'income', color: '#007bff', icon: 'bx-gift' },
      { id: '3', name: 'Programa de Afiliados', type: 'income', color: '#17a2b8', icon: 'bx-link' },
      { id: '4', name: 'Venda Direta', type: 'income', color: '#6f42c1', icon: 'bx-cart' },
      { id: '5', name: 'Equipamento', type: 'expense', color: '#dc3545', icon: 'bx-camera' },
      { id: '6', name: 'Software', type: 'expense', color: '#fd7e14', icon: 'bx-code' },
      { id: '7', name: 'Serviços', type: 'expense', color: '#20c997', icon: 'bx-server' },
      { id: '8', name: 'Impostos', type: 'expense', color: '#6c757d', icon: 'bx-file' }
    ];
    populateCategoryDropdowns(demoCategories);
  };

  // Função para carregar métodos de pagamento
  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payment-methods');
      if (!response.ok) {
        throw new Error('Erro ao carregar métodos de pagamento');
      }
      
      const data = await response.json();
      populatePaymentMethodDropdown(data.paymentMethods);
    } catch (error) {
      console.error('Erro ao carregar métodos de pagamento:', error);
      // Usar dados estáticos se a API falhar
      useDemoPaymentMethods();
    }
  };

  // Preencher a dropdown de métodos de pagamento
  const populatePaymentMethodDropdown = (paymentMethods) => {
    const paymentMethodSelect = document.getElementById('transactionPaymentMethod');
    if (!paymentMethodSelect) return;
    
    // Limpar opções existentes (mantendo a primeira)
    paymentMethodSelect.innerHTML = '<option value="">Selecione...</option>';
    
    // Adicionar métodos de pagamento
    paymentMethods.forEach(method => {
      const option = document.createElement('option');
      option.value = method.id;
      option.textContent = method.name;
      paymentMethodSelect.appendChild(option);
    });
  };

  // Usar métodos de pagamento de demonstração
  const useDemoPaymentMethods = () => {
    const demoPaymentMethods = [
      { id: '1', name: 'Pix', icon: 'bx-qr' },
      { id: '2', name: 'Cartão de Crédito', icon: 'bx-credit-card' },
      { id: '3', name: 'Transferência Bancária', icon: 'bx-transfer' },
      { id: '4', name: 'Dinheiro', icon: 'bx-money' }
    ];
    populatePaymentMethodDropdown(demoPaymentMethods);
  };

  // Função para alternar entre categoria baseada no tipo de transação
  const setupTransactionTypeChange = () => {
    const transactionType = document.getElementById('transactionType');
    if (!transactionType) return;
    
    transactionType.addEventListener('change', function() {
      const selectedType = this.value;
      const categorySelect = document.getElementById('transactionCategory');
      
      // Reset da seleção de categoria
      categorySelect.value = '';
      
      // Habilitar/desabilitar grupos de optgroup baseado no tipo
      Array.from(categorySelect.querySelectorAll('optgroup')).forEach(group => {
        if (selectedType === 'income' && group.label === 'Receitas') {
          group.disabled = false;
        } else if (selectedType === 'expense' && group.label === 'Despesas') {
          group.disabled = false;
        } else {
          group.disabled = true;
        }
      });
    });
  };

  // Carregar transações
  const loadTransactions = async () => {
    try {
      // Construir os parâmetros da query
      let queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage
      });
      
      // Adicionar filtros se estiverem definidos
      if (currentFilters.type) queryParams.append('type', currentFilters.type);
      if (currentFilters.category_id) queryParams.append('category_id', currentFilters.category_id);
      if (currentFilters.start_date) queryParams.append('start_date', currentFilters.start_date);
      if (currentFilters.end_date) queryParams.append('end_date', currentFilters.end_date);
      
      const response = await fetch(`/api/transactions?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar transações');
      }
      
      const data = await response.json();
      populateTransactionsTable(data.transactions);
      totalItems = data.total || data.transactions.length;
      setupPagination();
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      // Usar dados estáticos se a API falhar
      useDemoTransactions();
    }
  };

  // Preencher a tabela de transações
  const populateTransactionsTable = (transactions) => {
    const tableBody = document.querySelector('#transactionsTable tbody');
    if (!tableBody) return;
    
    // Limpar tabela existente
    tableBody.innerHTML = '';
    
    if (transactions && transactions.length > 0) {
      transactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Formatar os dados da transação
        const type = transaction.type === 'income' ? 'Receita' : 'Despesa';
        const icon = transaction.type === 'income' 
          ? '<i class="bx bx-trending-up text-success me-1"></i>' 
          : '<i class="bx bx-trending-down text-danger me-1"></i>';
        const date = new Date(transaction.date).toLocaleDateString('pt-BR');
        const status = '<span class="badge bg-label-success me-1">Concluído</span>';
        const amount = `R$ ${parseFloat(transaction.amount).toFixed(2).replace('.', ',')}`;
        const amountClass = transaction.type === 'income' ? 'text-success' : 'text-danger';
        
        // Obter informações da categoria
        let categoryBadge = '';
        if (transaction.category) {
          const category = transaction.category;
          categoryBadge = `<span class="badge bg-label-${transaction.type === 'income' ? 'primary' : 'danger'}">${category.name}</span>`;
        } else {
          categoryBadge = `<span class="badge bg-label-secondary">${type}</span>`;
        }
        
        // Obter informações do canal
        let channelInfo = '-';
        if (transaction.channels && transaction.channels.length > 0) {
          const channelIcons = {
            'youtube': '<i class="bx bxl-youtube text-danger"></i>',
            'instagram': '<i class="bx bxl-instagram text-primary"></i>',
            'tiktok': '<i class="bx bxl-tiktok text-dark"></i>'
          };
          
          channelInfo = transaction.channels.map(channel => {
            return channelIcons[channel.name.toLowerCase()] || channel.name;
          }).join(' ');
        }
        
        // Construir a linha
        row.innerHTML = `
          <td>${icon} #${transaction.id.substring(0, 4)}</td>
          <td>${date}</td>
          <td>${transaction.description}</td>
          <td>${categoryBadge}</td>
          <td>${channelInfo}</td>
          <td><strong class="${amountClass}">${amount}</strong></td>
          <td>${status}</td>
          <td>
            <div class="dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="javascript:editTransaction('${transaction.id}');">
                  <i class="bx bx-edit-alt me-1"></i> Editar
                </a>
                <a class="dropdown-item" href="javascript:deleteTransaction('${transaction.id}');">
                  <i class="bx bx-trash me-1"></i> Excluir
                </a>
                ${transaction.receipt_url ? 
                  `<a class="dropdown-item" href="${transaction.receipt_url}" target="_blank">
                    <i class="bx bx-file me-1"></i> Ver Comprovante
                  </a>` : ''}
              </div>
            </div>
          </td>
        `;
        
        tableBody.appendChild(row);
      });
    } else {
      // Sem transações
      const row = document.createElement('tr');
      row.innerHTML = `
        <td colspan="8" class="text-center">Nenhuma transação encontrada</td>
      `;
      tableBody.appendChild(row);
    }
  };

  // Usar transações de demonstração
  const useDemoTransactions = () => {
    const demoTransactions = [
      { 
        id: '1258', type: 'income', date: '2023-06-12', description: 'Pagamento de patrocínio',
        amount: 1200.00, category: { name: 'Patrocínio' }, channels: [{ name: 'instagram' }]
      },
      { 
        id: '1257', type: 'expense', date: '2023-06-10', description: 'Equipamento de gravação',
        amount: 750.00, category: { name: 'Equipamento' }, channels: [{ name: 'youtube' }]
      },
      { 
        id: '1256', type: 'income', date: '2023-06-08', description: 'Monetização YouTube',
        amount: 850.75, category: { name: 'AdSense' }, channels: [{ name: 'youtube' }]
      },
      { 
        id: '1255', type: 'expense', date: '2023-06-05', description: 'Software de edição',
        amount: 129.99, category: { name: 'Software' }, channels: []
      },
      { 
        id: '1254', type: 'income', date: '2023-06-01', description: 'Patrocínio Instagram',
        amount: 500.00, category: { name: 'Patrocínio' }, channels: [{ name: 'instagram' }]
      }
    ];
    
    populateTransactionsTable(demoTransactions);
    totalItems = 25; // Total simulado para paginação
    setupPagination();
  };

  // Configurar paginação
  const setupPagination = () => {
    const paginationElement = document.querySelector('.pagination');
    if (!paginationElement) return;
    
    // Limpar paginação existente
    paginationElement.innerHTML = '';
    
    // Calcular número total de páginas
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Botão "Anterior"
    const prevLi = document.createElement('li');
    prevLi.classList.add('page-item', 'prev');
    prevLi.innerHTML = `<a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevrons-left"></i></a>`;
    prevLi.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        loadTransactions();
      }
    });
    if (currentPage === 1) {
      prevLi.classList.add('disabled');
    }
    paginationElement.appendChild(prevLi);
    
    // Botões de páginas
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      const pageLi = document.createElement('li');
      pageLi.classList.add('page-item');
      if (i === currentPage) {
        pageLi.classList.add('active');
      }
      pageLi.innerHTML = `<a class="page-link" href="javascript:void(0);">${i}</a>`;
      pageLi.addEventListener('click', () => {
        currentPage = i;
        loadTransactions();
      });
      paginationElement.appendChild(pageLi);
    }
    
    // Botão "Próximo"
    const nextLi = document.createElement('li');
    nextLi.classList.add('page-item', 'next');
    nextLi.innerHTML = `<a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevrons-right"></i></a>`;
    nextLi.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        loadTransactions();
      }
    });
    if (currentPage === totalPages) {
      nextLi.classList.add('disabled');
    }
    paginationElement.appendChild(nextLi);
    
    // Atualizar contador de itens
    const itemCounter = document.querySelector('.item-counter');
    if (itemCounter) {
      const start = (currentPage - 1) * itemsPerPage + 1;
      const end = Math.min(currentPage * itemsPerPage, totalItems);
      itemCounter.textContent = `Mostrando ${start}-${end} de ${totalItems} itens`;
    }
  };

  // Configurar formulário de nova transação
  const setupNewTransactionForm = () => {
    const form = document.getElementById('formNewTransaction');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Obter valores do formulário
      const formData = {
        type: document.getElementById('transactionType').value,
        date: document.getElementById('transactionDate').value,
        description: document.getElementById('transactionDescription').value,
        amount: parseFloat(document.getElementById('transactionAmount').value),
        category_id: document.getElementById('transactionCategory').value,
        payment_method_id: document.getElementById('transactionPaymentMethod')?.value || null,
        notes: document.getElementById('transactionNotes').value,
        // Obter canais selecionados
        channels: Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
          .map(checkbox => checkbox.value)
      };
      
      // Processar upload de arquivo se existir
      const fileInput = document.getElementById('formFile');
      if (fileInput && fileInput.files.length > 0) {
        // Aqui seria implementado o upload do arquivo para o servidor
        // Por enquanto, apenas simulamos o URL do comprovante
        formData.receipt_url = 'https://example.com/uploads/' + fileInput.files[0].name;
      }
      
      try {
        // Enviar dados para a API
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Erro ao salvar transação');
        }
        
        // Exibir mensagem de sucesso
        showToast('Transação salva com sucesso!', 'success');
        
        // Resetar formulário
        form.reset();
        
        // Fechar o formulário de nova transação
        const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('collapseExample'));
        if (bsCollapse) {
          bsCollapse.hide();
        }
        
        // Recarregar transações
        loadTransactions();
      } catch (error) {
        console.error('Erro ao salvar transação:', error);
        showToast('Erro ao salvar transação. Tente novamente.', 'error');
      }
    });
  };

  // Configurar formulário de filtros
  const setupFilterForm = () => {
    const form = document.getElementById('filterTransactions');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Atualizar filtros
      currentFilters = {
        type: document.getElementById('filterType').value,
        category_id: document.getElementById('filterCategory').value,
        start_date: document.getElementById('filterDateFrom').value,
        end_date: document.getElementById('filterDateTo').value
      };
      
      // Resetar paginação
      currentPage = 1;
      
      // Recarregar transações
      loadTransactions();
    });
    
    // Resetar filtros
    form.addEventListener('reset', function() {
      setTimeout(() => {
        // Limpar filtros
        currentFilters = {};
        
        // Resetar paginação
        currentPage = 1;
        
        // Recarregar transações
        loadTransactions();
      }, 0);
    });
  };

  // Configurar exportação de transações
  const setupExportButton = () => {
    const exportButton = document.querySelector('.export-button');
    if (!exportButton) return;
    
    exportButton.addEventListener('click', async function() {
      try {
        // Construir parâmetros de query incluindo filtros
        let queryParams = new URLSearchParams(currentFilters);
        queryParams.append('format', 'csv');
        
        // Redirecionar para endpoint de exportação
        window.location.href = `/api/transactions/export?${queryParams.toString()}`;
      } catch (error) {
        console.error('Erro ao exportar transações:', error);
        showToast('Erro ao exportar transações. Tente novamente.', 'error');
      }
    });
  };

  // Configurar ordenação de transações
  const setupSortOptions = () => {
    const sortOptions = document.querySelectorAll('.sort-option');
    if (!sortOptions.length) return;
    
    sortOptions.forEach(option => {
      option.addEventListener('click', function() {
        const sortBy = this.dataset.sort;
        const sortOrder = this.dataset.order;
        
        // Atualizar filtros
        currentFilters.sort_by = sortBy;
        currentFilters.sort_order = sortOrder;
        
        // Recarregar transações
        loadTransactions();
      });
    });
  };

  // Função para excluir transação
  window.deleteTransaction = async function(id) {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Erro ao excluir transação');
      }
      
      // Exibir mensagem de sucesso
      showToast('Transação excluída com sucesso!', 'success');
      
      // Recarregar transações
      loadTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      showToast('Erro ao excluir transação. Tente novamente.', 'error');
    }
  };

  // Função para editar transação
  window.editTransaction = async function(id) {
    try {
      const response = await fetch(`/api/transactions/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar transação');
      }
      
      const transaction = await response.json();
      
      // Abrir formulário de edição
      const form = document.getElementById('formNewTransaction');
      if (!form) return;
      
      // Abrir o collapse do formulário
      const bsCollapse = new bootstrap.Collapse(document.getElementById('collapseExample'), {
        toggle: false
      });
      bsCollapse.show();
      
      // Preencher formulário com dados da transação
      document.getElementById('transactionType').value = transaction.type;
      document.getElementById('transactionDate').value = transaction.date.substring(0, 10);
      document.getElementById('transactionDescription').value = transaction.description;
      document.getElementById('transactionAmount').value = transaction.amount;
      document.getElementById('transactionCategory').value = transaction.category_id;
      
      if (document.getElementById('transactionPaymentMethod')) {
        document.getElementById('transactionPaymentMethod').value = transaction.payment_method_id || '';
      }
      
      if (document.getElementById('transactionNotes')) {
        document.getElementById('transactionNotes').value = transaction.notes || '';
      }
      
      // Marcar checkboxes de canais
      if (transaction.channels) {
        // Primeiro, desmarcar todos
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
          checkbox.checked = false;
        });
        
        // Marcar os canais da transação
        transaction.channels.forEach(channel => {
          const checkbox = document.querySelector(`input[value="${channel.name.toLowerCase()}"]`);
          if (checkbox) {
            checkbox.checked = true;
          }
        });
      }
      
      // Adicionar ID da transação em um campo oculto para identificar que é uma edição
      let idField = document.getElementById('transactionId');
      if (!idField) {
        idField = document.createElement('input');
        idField.type = 'hidden';
        idField.id = 'transactionId';
        form.appendChild(idField);
      }
      idField.value = id;
      
      // Atualizar texto do botão de submit
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = 'Atualizar Transação';
      }
      
      // Modificar a ação do formulário para atualizar ao invés de criar
      const originalSubmit = form.onsubmit;
      form.onsubmit = async function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const formData = {
          type: document.getElementById('transactionType').value,
          date: document.getElementById('transactionDate').value,
          description: document.getElementById('transactionDescription').value,
          amount: parseFloat(document.getElementById('transactionAmount').value),
          category_id: document.getElementById('transactionCategory').value,
          payment_method_id: document.getElementById('transactionPaymentMethod')?.value || null,
          notes: document.getElementById('transactionNotes').value,
          // Obter canais selecionados
          channels: Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value)
        };
        
        try {
          // Enviar dados para a API
          const response = await fetch(`/api/transactions/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          
          if (!response.ok) {
            throw new Error('Erro ao atualizar transação');
          }
          
          // Exibir mensagem de sucesso
          showToast('Transação atualizada com sucesso!', 'success');
          
          // Resetar formulário
          form.reset();
          
          // Restaurar ação original do formulário
          form.onsubmit = originalSubmit;
          
          // Restaurar texto do botão
          if (submitButton) {
            submitButton.textContent = 'Salvar Transação';
          }
          
          // Remover campo de ID
          if (idField) {
            idField.remove();
          }
          
          // Fechar o formulário
          bsCollapse.hide();
          
          // Recarregar transações
          loadTransactions();
        } catch (error) {
          console.error('Erro ao atualizar transação:', error);
          showToast('Erro ao atualizar transação. Tente novamente.', 'error');
        }
      };
    } catch (error) {
      console.error('Erro ao carregar transação para edição:', error);
      showToast('Erro ao carregar transação. Tente novamente.', 'error');
    }
  };

  // Função para exibir toast de notificação
  const showToast = (message, type = 'info') => {
    // Verificar se já existe um container de toasts
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
    
    // Criar toast
    const toastId = 'toast-' + Date.now();
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0`;
    toastElement.id = toastId;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    toastElement.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    
    // Adicionar toast ao container
    toastContainer.appendChild(toastElement);
    
    // Inicializar e mostrar toast
    const toast = new bootstrap.Toast(toastElement, {
      autohide: true,
      delay: 5000
    });
    toast.show();
  };

  // Verificar parâmetros da URL para edição de transações
  const checkUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
      // Chamar função para editar transação
      editTransaction(editId);
    }
  };

  // Inicializar a página
  const init = () => {
    loadCategories();
    loadPaymentMethods();
    setupTransactionTypeChange();
    setupNewTransactionForm();
    setupFilterForm();
    setupExportButton();
    setupSortOptions();
    loadTransactions();
    checkUrlParams();
  };

  // Iniciar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
});
