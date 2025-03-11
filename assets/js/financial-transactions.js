
/**
 * Financial Transactions - Javascript
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Variáveis globais
  let currentPage = 1;
  const itemsPerPage = 10;
  let totalItems = 0; // Número total de itens (será atualizado após a busca na API)
  let currentFilters = {};
  let transactions = []; // Armazenar todas as transações

  // Armazenamento local de transações para demonstração (backup)
  const demoTransactions = [
    {
      id: '#1258',
      date: '12/06/2023',
      description: 'Pagamento de patrocínio',
      category: 'Patrocínio',
      channel: 'Instagram',
      amount: 1200.00,
      type: 'income',
      status: 'Concluído',
      notes: 'Patrocínio negociado direto com a marca.',
      receipt: '../assets/img/elements/receipt-sample.jpg'
    },
    {
      id: '#1257',
      date: '10/06/2023',
      description: 'Equipamento de gravação',
      category: 'Equipamento',
      channel: 'YouTube',
      amount: 750.00,
      type: 'expense',
      status: 'Concluído',
      notes: 'Microfone profissional para melhorar qualidade de áudio.',
      receipt: null
    },
    {
      id: '#1256',
      date: '08/06/2023',
      description: 'Monetização YouTube',
      category: 'AdSense',
      channel: 'YouTube',
      amount: 850.75,
      type: 'income',
      status: 'Concluído',
      notes: 'Pagamento mensal de monetização.',
      receipt: '../assets/img/elements/receipt-sample.jpg'
    },
    {
      id: '#1255',
      date: '05/06/2023',
      description: 'Software de edição',
      category: 'Software',
      channel: '',
      amount: 129.99,
      type: 'expense',
      status: 'Concluído',
      notes: 'Assinatura anual do software de edição premium.',
      receipt: null
    },
    {
      id: '#1254',
      date: '01/06/2023',
      description: 'Patrocínio Instagram',
      category: 'Patrocínio',
      channel: 'Instagram',
      amount: 500.00,
      type: 'income',
      status: 'Concluído',
      notes: 'Postagem patrocinada para marca de suplementos.',
      receipt: '../assets/img/elements/receipt-sample.jpg'
    }
  ];

  // Funções principais
  const init = function() {
    loadTransactions();
    setupEventListeners();
  };

  // Carregar transações
  const loadTransactions = function() {
    // Normalmente aqui faríamos uma chamada API, mas para demonstração usaremos dados locais
    transactions = [...demoTransactions];
    
    // Aplicar filtros (se existirem)
    applyFilters();
    
    // Atualizar o total de itens
    totalItems = transactions.length;
    
    // Renderizar a tabela
    renderTransactionsTable();
    
    // Atualizar a paginação
    updatePagination();
  };

  // Aplicar filtros nas transações
  const applyFilters = function() {
    // Se não há filtros ativos, retornar todas as transações
    if (Object.keys(currentFilters).length === 0) {
      return;
    }
    
    // Filtrar transações baseado nos critérios
    transactions = demoTransactions.filter(transaction => {
      // Filtrar por tipo
      if (currentFilters.type && transaction.type !== currentFilters.type) {
        return false;
      }
      
      // Filtrar por categoria
      if (currentFilters.category && transaction.category !== currentFilters.category) {
        return false;
      }
      
      // Filtrar por data (início)
      if (currentFilters.dateFrom) {
        const transactionDate = new Date(transaction.date.split('/').reverse().join('-'));
        const fromDate = new Date(currentFilters.dateFrom);
        if (transactionDate < fromDate) {
          return false;
        }
      }
      
      // Filtrar por data (fim)
      if (currentFilters.dateTo) {
        const transactionDate = new Date(transaction.date.split('/').reverse().join('-'));
        const toDate = new Date(currentFilters.dateTo);
        if (transactionDate > toDate) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Renderizar a tabela de transações
  const renderTransactionsTable = function() {
    const tableBody = document.querySelector('.table tbody');
    if (!tableBody) return;
    
    // Limpar tabela existente
    tableBody.innerHTML = '';
    
    // Calcular índices para paginação
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, transactions.length);
    
    // Se não há transações, mostrar mensagem
    if (transactions.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="8" class="text-center">Nenhuma transação encontrada.</td>`;
      tableBody.appendChild(row);
      return;
    }
    
    // Renderizar transações
    for (let i = startIndex; i < endIndex; i++) {
      const transaction = transactions[i];
      const row = document.createElement('tr');
      
      // Determinar ícones e classes
      const icon = transaction.type === 'income' 
                  ? '<i class="bx bx-trending-up text-success me-1"></i>' 
                  : '<i class="bx bx-trending-down text-danger me-1"></i>';
      
      const channelIcon = transaction.channel === 'YouTube' 
                        ? '<i class="bx bxl-youtube text-danger"></i>' 
                        : transaction.channel === 'Instagram' 
                          ? '<i class="bx bxl-instagram text-danger"></i>' 
                          : '';
      
      const amountClass = transaction.type === 'income' ? 'text-success' : 'text-danger';
      
      // Formatar o valor
      const amount = `R$ ${transaction.amount.toFixed(2).replace('.', ',')}`;
      
      // Construir badge de categoria
      const categoryBadgeClass = getCategoryBadgeClass(transaction.category);
      const categoryBadge = `<span class="badge ${categoryBadgeClass}">${transaction.category}</span>`;
      
      // Construir a linha
      row.innerHTML = `
        <td>${icon} ${transaction.id}</td>
        <td>${transaction.date}</td>
        <td>${transaction.description}</td>
        <td>${categoryBadge}</td>
        <td>${channelIcon} ${transaction.channel || '-'}</td>
        <td><strong class="${amountClass}">${amount}</strong></td>
        <td><span class="badge bg-label-success me-1">${transaction.status}</span></td>
        <td>
          <div class="dropdown">
            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
              <i class="bx bx-dots-vertical-rounded"></i>
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="javascript:void(0);" onclick="editTransaction('${transaction.id}')">
                <i class="bx bx-edit-alt me-1"></i> Editar
              </a>
              <a class="dropdown-item" href="javascript:void(0);" onclick="deleteTransaction('${transaction.id}')">
                <i class="bx bx-trash me-1"></i> Excluir
              </a>
              <a class="dropdown-item" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#transactionDetailsModal" onclick="showTransactionDetails('${transaction.id}')">
                <i class="bx bx-info-circle me-1"></i> Detalhes
              </a>
            </div>
          </div>
        </td>
      `;
      
      tableBody.appendChild(row);
    }
    
    // Atualizar o contador de itens mostrados
    updateItemsCounter(startIndex, endIndex);
  };

  // Atualizar o contador de itens mostrados
  const updateItemsCounter = function(startIndex, endIndex) {
    const counter = document.querySelector('.d-flex .me-2');
    if (counter) {
      counter.textContent = `Mostrando ${startIndex + 1}-${endIndex} de ${totalItems} itens`;
    }
  };

  // Atualizar a paginação
  const updatePagination = function() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    // Limpar paginação existente
    pagination.innerHTML = '';
    
    // Calcular número total de páginas
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Criar botão anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevrons-left"></i></a>`;
    prevLi.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTransactionsTable();
        updatePagination();
      }
    });
    pagination.appendChild(prevLi);
    
    // Criar botões de página
    for (let i = 1; i <= totalPages; i++) {
      const pageLi = document.createElement('li');
      pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
      pageLi.innerHTML = `<a class="page-link" href="javascript:void(0);">${i}</a>`;
      pageLi.addEventListener('click', () => {
        currentPage = i;
        renderTransactionsTable();
        updatePagination();
      });
      pagination.appendChild(pageLi);
    }
    
    // Criar botão próximo
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevrons-right"></i></a>`;
    nextLi.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderTransactionsTable();
        updatePagination();
      }
    });
    pagination.appendChild(nextLi);
  };

  // Configurar event listeners
  const setupEventListeners = function() {
    // Formulário de nova transação
    const formNewTransaction = document.getElementById('formNewTransaction');
    if (formNewTransaction) {
      formNewTransaction.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter dados do formulário
        const newTransaction = {
          id: '#' + Math.floor(1000 + Math.random() * 9000),
          date: document.getElementById('transactionDate').value.split('-').reverse().join('/'),
          description: document.getElementById('transactionDescription').value,
          category: document.getElementById('transactionCategory').options[document.getElementById('transactionCategory').selectedIndex].text,
          amount: parseFloat(document.getElementById('transactionAmount').value),
          type: document.getElementById('transactionType').value,
          status: 'Concluído',
          notes: document.getElementById('transactionNotes').value,
          receipt: null
        };
        
        // Adicionar canal
        const channels = [];
        if (document.getElementById('youtube').checked) channels.push('YouTube');
        if (document.getElementById('instagram').checked) channels.push('Instagram');
        if (document.getElementById('tiktok').checked) channels.push('TikTok');
        newTransaction.channel = channels.join(', ');
        
        // Adicionar à lista de transações
        transactions.unshift(newTransaction);
        demoTransactions.unshift(newTransaction);
        totalItems++;
        
        // Resetar para a primeira página e atualizar
        currentPage = 1;
        renderTransactionsTable();
        updatePagination();
        
        // Resetar formulário e fechar
        this.reset();
        const bsCollapse = new bootstrap.Collapse(document.getElementById('collapseExample'), {
          toggle: false
        });
        bsCollapse.hide();
        
        // Mostrar mensagem de sucesso
        alert('Transação adicionada com sucesso!');
      });
    }
    
    // Formulário de filtros
    const filterForm = document.getElementById('filterTransactions');
    if (filterForm) {
      filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpar filtros atuais
        currentFilters = {};
        
        // Obter valores do formulário
        const filterType = document.getElementById('filterType').value;
        const filterCategory = document.getElementById('filterCategory').value;
        const filterDateFrom = document.getElementById('filterDateFrom').value;
        const filterDateTo = document.getElementById('filterDateTo').value;
        
        // Adicionar filtros se não estiverem vazios
        if (filterType) currentFilters.type = filterType;
        if (filterCategory) currentFilters.category = filterCategory;
        if (filterDateFrom) currentFilters.dateFrom = filterDateFrom;
        if (filterDateTo) currentFilters.dateTo = filterDateTo;
        
        // Resetar para a primeira página
        currentPage = 1;
        
        // Carregar transações novamente (aplicará os filtros)
        loadTransactions();
        
        // Mostrar mensagem de sucesso
        if (Object.keys(currentFilters).length > 0) {
          alert('Filtros aplicados com sucesso!');
        }
      });
      
      // Resetar filtros
      filterForm.addEventListener('reset', function() {
        setTimeout(() => {
          currentFilters = {};
          currentPage = 1;
          loadTransactions();
          alert('Filtros removidos!');
        }, 100);
      });
    }
    
    // Ordenação
    const sortOptions = document.querySelectorAll('.dropdown-menu .dropdown-item[href="javascript:void(0);"]');
    if (sortOptions.length > 0) {
      sortOptions.forEach(option => {
        option.addEventListener('click', function() {
          const sortOption = this.textContent.trim();
          
          // Ordenar transações com base na opção selecionada
          switch(sortOption) {
            case 'Data (recente)':
              transactions.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
              break;
            case 'Data (antiga)':
              transactions.sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));
              break;
            case 'Valor (maior)':
              transactions.sort((a, b) => b.amount - a.amount);
              break;
            case 'Valor (menor)':
              transactions.sort((a, b) => a.amount - b.amount);
              break;
            case 'Categoria (A-Z)':
              transactions.sort((a, b) => a.category.localeCompare(b.category));
              break;
          }
          
          // Atualizar a tabela
          renderTransactionsTable();
        });
      });
    }
    
    // Exportar CSV
    const exportButton = document.querySelector('button.btn-outline-secondary');
    if (exportButton) {
      exportButton.addEventListener('click', function() {
        exportToCSV();
      });
    }
    
    // Alterar número de itens por página
    const perPageSelect = document.querySelector('.form-select.form-select-sm');
    if (perPageSelect) {
      perPageSelect.addEventListener('change', function() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1;
        renderTransactionsTable();
        updatePagination();
      });
    }
  };

  // Exportar para CSV
  const exportToCSV = function() {
    // Se não há transações, retornar
    if (transactions.length === 0) {
      alert('Não há transações para exportar.');
      return;
    }
    
    // Criar cabeçalho do CSV
    let csv = 'ID,Data,Descrição,Categoria,Canal,Valor,Tipo,Status,Observações\n';
    
    // Adicionar cada transação
    transactions.forEach(transaction => {
      csv += `${transaction.id},`;
      csv += `${transaction.date},`;
      csv += `"${transaction.description}",`;
      csv += `"${transaction.category}",`;
      csv += `"${transaction.channel}",`;
      csv += `${transaction.amount},`;
      csv += `${transaction.type === 'income' ? 'Receita' : 'Despesa'},`;
      csv += `${transaction.status},`;
      csv += `"${transaction.notes}"\n`;
    });
    
    // Criar link para download
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.target = '_blank';
    link.download = 'transacoes.csv';
    link.click();
  };

  // Funções auxiliares
  const getCategoryBadgeClass = function(category) {
    switch(category) {
      case 'Patrocínio':
        return 'bg-label-primary';
      case 'AdSense':
        return 'bg-label-success';
      case 'Programa de Afiliados':
        return 'bg-label-info';
      case 'Venda Direta':
        return 'bg-label-dark';
      case 'Equipamento':
        return 'bg-label-danger';
      case 'Software':
        return 'bg-label-warning';
      case 'Serviços':
        return 'bg-label-secondary';
      case 'Impostos':
        return 'bg-label-dark';
      default:
        return 'bg-label-primary';
    }
  };

  // Funções expostas globalmente
  window.editTransaction = function(id) {
    alert(`Função de edição para a transação ${id} será implementada em breve.`);
  };

  window.deleteTransaction = function(id) {
    if (confirm(`Tem certeza que deseja excluir a transação ${id}?`)) {
      // Encontrar índice da transação
      const index = transactions.findIndex(transaction => transaction.id === id);
      if (index !== -1) {
        // Remover da lista de transações
        transactions.splice(index, 1);
        
        // Remover também dos dados de demo
        const demoIndex = demoTransactions.findIndex(transaction => transaction.id === id);
        if (demoIndex !== -1) {
          demoTransactions.splice(demoIndex, 1);
        }
        
        // Atualizar total de itens
        totalItems--;
        
        // Se a página atual estiver vazia, voltar uma página
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          currentPage = totalPages;
        }
        
        // Atualizar tabela e paginação
        renderTransactionsTable();
        updatePagination();
        
        alert('Transação excluída com sucesso!');
      }
    }
  };

  window.showTransactionDetails = function(id) {
    // Esta função seria chamada quando o modal de detalhes é aberto
    // No modal, podemos mostrar mais informações sobre a transação
    alert(`Detalhes da transação ${id} serão implementados em breve.`);
  };

  // Inicializar
  init();
});
