/**
 * Gerenciamento de Transações Financeiras - KOT (Keep on Track)
 */

'use strict';

// Array para armazenar as transações
let transactions = [
  {
    id: '1258',
    date: '12/06/2023',
    description: 'Pagamento de patrocínio',
    category: 'Patrocínio',
    channel: 'Instagram',
    amount: 1200.00,
    type: 'income',
    status: 'Concluído'
  },
  {
    id: '1257',
    date: '10/06/2023',
    description: 'Equipamento de gravação',
    category: 'Equipamento',
    channel: 'YouTube',
    amount: 750.00,
    type: 'expense',
    status: 'Concluído'
  },
  {
    id: '1256',
    date: '08/06/2023',
    description: 'Monetização YouTube',
    category: 'AdSense',
    channel: 'YouTube',
    amount: 850.75,
    type: 'income',
    status: 'Concluído'
  },
  {
    id: '1255',
    date: '05/06/2023',
    description: 'Software de edição',
    category: 'Software',
    channel: '',
    amount: 129.99,
    type: 'expense',
    status: 'Concluído'
  },
  {
    id: '1254',
    date: '01/06/2023',
    description: 'Patrocínio Instagram',
    category: 'Patrocínio',
    channel: 'Instagram',
    amount: 500.00,
    type: 'income',
    status: 'Concluído'
  }
];

// Função para gerar um ID único
function generateID() {
  return Date.now().toString().slice(-4);
}

// Função para formatar valores monetários
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para formatar data
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

// Função para adicionar uma nova transação
function addTransaction(transaction) {
  // Gerar ID para a nova transação
  transaction.id = generateID();

  // Adicionar ao início do array
  transactions.unshift(transaction);

  // Renderizar novamente a tabela
  renderTransactions(transactions);
}

// Função para renderizar as transações na tabela
function renderTransactions(transactionsArray) {
  const tbody = document.querySelector('table tbody');

  // Limpar corpo da tabela
  if (tbody) {
    tbody.innerHTML = '';

    // Adicionar cada transação
    transactionsArray.forEach(transaction => {
      const row = document.createElement('tr');

      // Formatação de acordo com o tipo de transação
      const iconClass = transaction.type === 'income' ? 'bx-trending-up text-success' : 'bx-trending-down text-danger';
      const amountClass = transaction.type === 'income' ? 'text-success' : 'text-danger';
      const categoryBadgeClass = transaction.type === 'income' ? 'bg-label-success' : 'bg-label-danger';

      // HTML da linha
      row.innerHTML = `
        <td><i class="bx ${iconClass} me-1"></i> #${transaction.id}</td>
        <td>${transaction.date}</td>
        <td>${transaction.description}</td>
        <td><span class="badge ${categoryBadgeClass}">${transaction.category}</span></td>
        <td>${transaction.channel ? `<i class="bx bxl-${transaction.channel.toLowerCase()} text-danger"></i> ${transaction.channel}` : '-'}</td>
        <td><strong class="${amountClass}">${formatCurrency(transaction.amount)}</strong></td>
        <td><span class="badge bg-label-success me-1">${transaction.status}</span></td>
        <td>
          <div class="dropdown">
            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
              <i class="bx bx-dots-vertical-rounded"></i>
            </button>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-edit-alt me-1"></i> Editar</a>
              <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-trash me-1"></i> Excluir</a>
              <a class="dropdown-item" href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#transactionDetailsModal"><i class="bx bx-info-circle me-1"></i> Detalhes</a>
            </div>
          </div>
        </td>
      `;

      tbody.appendChild(row);
    });
  }
}

// Evento para quando o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
  // Renderizar transações iniciais
  renderTransactions(transactions);

  // Pegar formulário de nova transação
  const newTransactionForm = document.getElementById('formNewTransaction');

  // Adicionar evento para a submissão do formulário
  if (newTransactionForm) {
    newTransactionForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Coletar dados do formulário
      const type = document.getElementById('transactionType').value;
      const category = document.getElementById('transactionCategory').value;
      const amount = parseFloat(document.getElementById('transactionAmount').value);
      const date = document.getElementById('transactionDate').value;
      const description = document.getElementById('transactionDescription').value;
      const notes = document.getElementById('transactionNotes').value;

      // Verificar canais selecionados
      const channels = [];
      if (document.getElementById('youtube').checked) channels.push('YouTube');
      if (document.getElementById('instagram').checked) channels.push('Instagram');
      if (document.getElementById('tiktok').checked) channels.push('TikTok');

      // Criar nova transação
      const newTransaction = {
        date: formatDate(date),
        description: description,
        category: document.getElementById('transactionCategory').options[document.getElementById('transactionCategory').selectedIndex].text,
        channel: channels.join(', '),
        amount: amount,
        type: type,
        status: 'Concluído',
        notes: notes
      };

      // Adicionar à lista e atualizar a interface
      addTransaction(newTransaction);

      // Resetar formulário
      newTransactionForm.reset();

      // Fechar o formulário
      const bsCollapse = new bootstrap.Collapse(document.getElementById('collapseExample'));
      bsCollapse.hide();

      // Mostrar alerta de sucesso
      alert('Transação adicionada com sucesso!');
    });
  }

  // Configurar filtros
  const filterForm = document.getElementById('filterTransactions');
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Coletar critérios de filtro
      const filterType = document.getElementById('filterType').value;
      const filterCategory = document.getElementById('filterCategory').value;
      const filterDateFrom = document.getElementById('filterDateFrom').value;
      const filterDateTo = document.getElementById('filterDateTo').value;

      // Filtrar transações
      let filteredTransactions = [...transactions];

      // Filtrar por tipo
      if (filterType) {
        filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
      }

      // Filtrar por categoria (ignorando maiúsculas/minúsculas)
      if (filterCategory) {
        filteredTransactions = filteredTransactions.filter(t =>
          t.category.toLowerCase().includes(filterCategory.toLowerCase())
        );
      }

      // Filtrar por data inicial
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        filteredTransactions = filteredTransactions.filter(t => {
          const tDate = new Date(t.date.split('/').reverse().join('-'));
          return tDate >= fromDate;
        });
      }

      // Filtrar por data final
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        filteredTransactions = filteredTransactions.filter(t => {
          const tDate = new Date(t.date.split('/').reverse().join('-'));
          return tDate <= toDate;
        });
      }

      // Renderizar resultados filtrados
      renderTransactions(filteredTransactions);
    });

    // Resetar filtros
    filterForm.addEventListener('reset', function() {
      setTimeout(() => renderTransactions(transactions), 10);
    });
  }

  // Configurar ordenação
  const sortOptions = document.querySelectorAll('.dropdown-menu .dropdown-item[href="javascript:void(0);"]');
  sortOptions.forEach(option => {
    option.addEventListener('click', function() {
      let sortedTransactions = [...transactions];

      // Ordenar com base no texto do item selecionado
      const sortText = this.textContent.trim();

      if (sortText === 'Data (recente)') {
        sortedTransactions.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
      } else if (sortText === 'Data (antiga)') {
        sortedTransactions.sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));
      } else if (sortText === 'Valor (maior)') {
        sortedTransactions.sort((a, b) => b.amount - a.amount);
      } else if (sortText === 'Valor (menor)') {
        sortedTransactions.sort((a, b) => a.amount - b.amount);
      } else if (sortText === 'Categoria (A-Z)') {
        sortedTransactions.sort((a, b) => a.category.localeCompare(b.category));
      }

      // Renderizar transações ordenadas
      renderTransactions(sortedTransactions);
    });
  });
});