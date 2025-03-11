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

  // Elementos DOM
  const formNewTransaction = document.getElementById('formNewTransaction');
  const filterForm = document.getElementById('filterTransactions');
  const transactionTable = document.querySelector('.table-border-bottom-0');
  const pagination = document.querySelector('.pagination');
  const dropdown = document.querySelector('.dropdown-menu');
  const transactionCountDisplay = document.querySelector('.d-flex.align-items-center.mb-3.mb-md-0 span');

  // Modal de detalhes
  const detailsModalHTML = `
    <div class="modal fade" id="transactionDetailsModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">Detalhes da Transação</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <h6>ID da Transação</h6>
                  <p id="detailId"></p>
                </div>
                <div class="mb-3">
                  <h6>Descrição</h6>
                  <p id="detailDescription"></p>
                </div>
                <div class="mb-3">
                  <h6>Categoria</h6>
                  <p id="detailCategory"></p>
                </div>
                <div class="mb-3">
                  <h6>Valor</h6>
                  <p id="detailAmount"></p>
                </div>
                <div class="mb-3">
                  <h6>Data</h6>
                  <p id="detailDate"></p>
                </div>
                <div class="mb-3">
                  <h6>Canal</h6>
                  <p id="detailChannel"></p>
                </div>
                <div class="mb-3">
                  <h6>Status</h6>
                  <p id="detailStatus"></p>
                </div>
                <div class="mb-3">
                  <h6>Observações</h6>
                  <p id="detailNotes"></p>
                </div>
              </div>
              <div class="col-md-6" id="receiptContainer">
                <div class="mb-3">
                  <h6>Comprovante</h6>
                  <div id="receiptContent" class="text-center">
                    <!-- Imagem ou mensagem aqui -->
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Adicionar modal ao corpo da página
  document.body.insertAdjacentHTML('beforeend', detailsModalHTML);

  // Função para renderizar as transações na tabela
  function renderTransactions(items) {
    if (!transactionTable) return;

    // Limpar conteúdo atual
    transactionTable.innerHTML = '';

    if (items.length === 0) {
      transactionTable.innerHTML = '<tr><td colspan="8" class="text-center">Nenhuma transação encontrada</td></tr>';
      return;
    }

    // Renderizar cada transação
    items.forEach(transaction => {
      const row = document.createElement('tr');
      const icon = transaction.type === 'income'
        ? '<i class="bx bx-trending-up text-success me-1"></i>'
        : '<i class="bx bx-trending-down text-danger me-1"></i>';

      const amountClass = transaction.type === 'income' ? 'text-success' : 'text-danger';
      const channelIcon = getChannelIcon(transaction.channel);
      const channelDisplay = transaction.channel ? `${channelIcon} ${transaction.channel}` : '-';

      row.innerHTML = `
        <td>${icon} ${transaction.id}</td>
        <td>${transaction.date}</td>
        <td>${transaction.description}</td>
        <td><span class="badge bg-label-${transaction.type === 'income' ? 'primary' : 'danger'}">${transaction.category}</span></td>
        <td>${channelDisplay}</td>
        <td><strong class="${amountClass}">R$ ${transaction.amount.toFixed(2).replace('.', ',')}</strong></td>
        <td><span class="badge bg-label-success me-1">${transaction.status}</span></td>
        <td>
          <div class="dropdown">
            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
              <i class="bx bx-dots-vertical-rounded"></i>
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="javascript:void(0);" onclick="editTransaction('${transaction.id}')"><i class="bx bx-edit-alt me-1"></i> Editar</a>
              <a class="dropdown-item" href="javascript:void(0);" onclick="deleteTransaction('${transaction.id}')"><i class="bx bx-trash me-1"></i> Excluir</a>
              <a class="dropdown-item" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#transactionDetailsModal" onclick="showTransactionDetails('${transaction.id}')"><i class="bx bx-info-circle me-1"></i> Detalhes</a>
            </div>
          </div>
        </td>
      `;

      transactionTable.appendChild(row);
    });

    // Atualizar contador de exibição
    if (transactionCountDisplay) {
      transactionCountDisplay.textContent = `Mostrando 1-${items.length} de ${transactions.length} itens`;
    }
  }

  // Função para obter ícone do canal
  function getChannelIcon(channel) {
    switch (channel) {
      case 'YouTube':
        return '<i class="bx bxl-youtube text-danger"></i>';
      case 'Instagram':
        return '<i class="bx bxl-instagram text-danger"></i>';
      case 'TikTok':
        return '<i class="bx bxl-tiktok text-dark"></i>';
      default:
        return '';
    }
  }

  // Função para mostrar detalhes da transação no modal
  window.showTransactionDetails = function(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    document.getElementById('detailId').textContent = transaction.id;
    document.getElementById('detailDescription').textContent = transaction.description;
    document.getElementById('detailCategory').textContent = transaction.category;
    document.getElementById('detailAmount').textContent = `R$ ${transaction.amount.toFixed(2).replace('.', ',')}`;
    document.getElementById('detailDate').textContent = transaction.date;
    document.getElementById('detailChannel').textContent = transaction.channel || 'Nenhum';
    document.getElementById('detailStatus').textContent = transaction.status;
    document.getElementById('detailNotes').textContent = transaction.notes || 'Nenhuma observação';

    const receiptContent = document.getElementById('receiptContent');
    if (transaction.receipt) {
      receiptContent.innerHTML = `<img src="${transaction.receipt}" alt="Comprovante" class="img-fluid" style="max-height: 300px;">`;
    } else {
      receiptContent.innerHTML = '<p class="text-muted">Nenhum comprovante disponível</p>';
    }
  };

  // Função para editar transação
  window.editTransaction = function(id) {
    alert(`Edição da transação ${id} será implementada em breve.`);
  };

  // Função para excluir transação
  window.deleteTransaction = function(id) {
    if (confirm(`Tem certeza que deseja excluir a transação ${id}?`)) {
      transactions = transactions.filter(t => t.id !== id);
      renderTransactions(transactions);
      alert(`Transação ${id} excluída com sucesso!`);
    }
  };

  // Evento de submissão do formulário de nova transação
  if (formNewTransaction) {
    formNewTransaction.addEventListener('submit', function(e) {
      e.preventDefault();

      // Coletar valores do formulário
      const type = document.getElementById('transactionType').value;
      const category = document.getElementById('transactionCategory').value;
      const amount = parseFloat(document.getElementById('transactionAmount').value);
      const date = document.getElementById('transactionDate').value;
      const description = document.getElementById('transactionDescription').value;
      const notes = document.getElementById('transactionNotes').value;

      // Verificar canais selecionados
      let channels = [];
      if (document.getElementById('youtube').checked) channels.push('YouTube');
      if (document.getElementById('instagram').checked) channels.push('Instagram');
      if (document.getElementById('tiktok').checked) channels.push('TikTok');

      // Formatar data para exibição
      const formattedDate = formatDate(date);

      // Criar nova transação
      const newTransaction = {
        id: `#${1259 + transactions.length}`,
        date: formattedDate,
        description: description,
        category: getCategoryLabel(category),
        channel: channels.length > 0 ? channels[0] : '',
        amount: amount,
        type: type,
        status: 'Concluído',
        notes: notes,
        receipt: null
      };

      // Adicionar ao array e renderizar
      transactions.unshift(newTransaction);
      renderTransactions(transactions);

      // Resetar formulário e fechar
      this.reset();
      const bsCollapse = new bootstrap.Collapse(document.getElementById('collapseExample'), {
        toggle: false
      });
      bsCollapse.hide();

      // Alertar sucesso
      alert('Transação salva com sucesso!');
    });
  }

  // Função para formatar data
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  // Função para obter label da categoria
  function getCategoryLabel(value) {
    const categories = {
      'adsense': 'AdSense',
      'sponsorship': 'Patrocínio',
      'affiliate': 'Programa de Afiliados',
      'direct_sale': 'Venda Direta',
      'equipment': 'Equipamento',
      'software': 'Software',
      'services': 'Serviços',
      'tax': 'Impostos'
    };

    return categories[value] || value;
  }

  // Evento de submissão do formulário de filtros
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const filterType = document.getElementById('filterType').value;
      const filterCategory = document.getElementById('filterCategory').value;
      const filterDateFrom = document.getElementById('filterDateFrom').value;
      const filterDateTo = document.getElementById('filterDateTo').value;

      // Aplicar filtros
      let filtered = transactions.filter(transaction => {
        // Filtrar por tipo
        if (filterType && transaction.type !== filterType) return false;

        // Filtrar por categoria
        if (filterCategory) {
          const categoryLabel = getCategoryLabel(filterCategory).toLowerCase();
          if (transaction.category.toLowerCase() !== categoryLabel) return false;
        }

        // Filtrar por data
        if (filterDateFrom || filterDateTo) {
          const txDate = new Date(transaction.date.split('/').reverse().join('-'));

          if (filterDateFrom) {
            const fromDate = new Date(filterDateFrom);
            if (txDate < fromDate) return false;
          }

          if (filterDateTo) {
            const toDate = new Date(filterDateTo);
            toDate.setHours(23, 59, 59);
            if (txDate > toDate) return false;
          }
        }

        return true;
      });

      renderTransactions(filtered);
    });

    // Resetar filtros
    filterForm.querySelector('button[type="reset"]').addEventListener('click', function() {
      setTimeout(() => {
        renderTransactions(transactions);
      }, 100);
    });
  }

  // Implementar ordenação
  const sortLinks = document.querySelectorAll('.dropdown-menu a.dropdown-item');
  if (sortLinks) {
    sortLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const sortText = this.textContent.trim();
        let sorted = [...transactions];

        switch (sortText) {
          case 'Data (recente)':
            sorted.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
            break;
          case 'Data (antiga)':
            sorted.sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));
            break;
          case 'Valor (maior)':
            sorted.sort((a, b) => b.amount - a.amount);
            break;
          case 'Valor (menor)':
            sorted.sort((a, b) => a.amount - b.amount);
            break;
          case 'Categoria (A-Z)':
            sorted.sort((a, b) => a.category.localeCompare(b.category));
            break;
        }

        renderTransactions(sorted);
      });
    });
  }

  // Implementar paginação (Simulação por enquanto)
  if (pagination) {
    const pageLinks = pagination.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        // Simulação de paginação para demonstração
        const pageNumber = this.textContent.trim();
        if (!isNaN(pageNumber)) {
          alert(`Navegando para a página ${pageNumber}`);
        } else if (this.querySelector('i.bx-chevrons-left')) {
          alert('Navegando para a página anterior');
        } else if (this.querySelector('i.bx-chevrons-right')) {
          alert('Navegando para a próxima página');
        }
      });
    });
  }


  // Função para carregar e exibir transações da API
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
      transactions = data.transactions;
      totalItems = data.total || data.transactions.length;
      renderTransactions(transactions); // Use the new rendering function

    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      // Usar dados de demonstração em caso de erro
      transactions = [...demoTransactions];
      renderTransactions(transactions); // Use the new rendering function
    }
  };


  // Carregar categorias (original code remains largely unchanged)
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

  // Função para preencher dropdowns de categorias (original code remains largely unchanged)
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

  // Função para usar categorias de demonstração (original code remains largely unchanged)
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


  // Inicializar a página
  const init = () => {
    loadCategories();
    loadTransactions(); // Load transactions after categories are loaded
  };

  // Executar inicialização
  init();

});