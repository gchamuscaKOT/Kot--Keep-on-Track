
/**
 * Página de Transações Financeiras
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Variáveis globais
  let currentPage = 1;
  const itemsPerPage = 10;
  let totalItems = 0;
  let currentFilters = {};

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
