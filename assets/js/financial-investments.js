
/**
 * Financial Investments - Javascript
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

  // Portfólio - Gráfico de Composição
  const portfolioCompositionEl = document.querySelector('#portfolioComposition');
  if (portfolioCompositionEl) {
    const portfolioCompositionConfig = {
      chart: {
        height: 300,
        type: 'pie'
      },
      labels: ['Renda Fixa', 'Renda Variável', 'Fundos Imobiliários', 'Criptomoedas'],
      series: [15425.75, 16190.75, 3745, 1815],
      colors: [primaryColor, dangerColor, warningColor, infoColor],
      stroke: {
        width: 0
      },
      legend: {
        show: true,
        position: 'bottom',
        fontFamily: 'Public Sans',
        labels: {
          colors: labelColor
        }
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return 'R$ ' + value.toFixed(2);
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    const portfolioCompositionChart = new ApexCharts(portfolioCompositionEl, portfolioCompositionConfig);
    portfolioCompositionChart.render();
  }

  // Desempenho por Classe de Ativo
  const assetClassPerformanceEl = document.querySelector('#assetClassPerformance');
  if (assetClassPerformanceEl) {
    const assetClassPerformanceConfig = {
      chart: {
        height: 300,
        type: 'bar'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      series: [{
        name: 'Retorno Anual (%)',
        data: [8.5, 5.0, 7.0, 10.0]
      }],
      xaxis: {
        categories: ['Renda Fixa', 'Renda Variável', 'Fundos Imobiliários', 'Criptomoedas'],
        labels: {
          style: {
            colors: labelColor,
            fontFamily: 'Public Sans'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Retorno Anual (%)',
          style: {
            color: labelColor,
            fontFamily: 'Public Sans'
          }
        },
        labels: {
          style: {
            colors: labelColor,
            fontFamily: 'Public Sans'
          }
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val + "%";
          }
        }
      },
      colors: [primaryColor]
    };

    const assetClassPerformanceChart = new ApexCharts(assetClassPerformanceEl, assetClassPerformanceConfig);
    assetClassPerformanceChart.render();
  }

  // Formulário de novo investimento
  const newInvestmentForm = document.getElementById('newInvestmentForm');
  const saveInvestmentBtn = document.getElementById('saveInvestment');

  if (newInvestmentForm && saveInvestmentBtn) {
    saveInvestmentBtn.addEventListener('click', function() {
      // Verificação simples de validação
      const assetName = document.getElementById('assetName').value;
      const assetClass = document.getElementById('assetClass').value;
      const investedAmount = document.getElementById('investedAmount').value;
      const acquisitionDate = document.getElementById('acquisitionDate').value;

      if (!assetName || !assetClass || !investedAmount || !acquisitionDate) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Simulação de adição de novo investimento
      const currentValue = document.getElementById('currentValue').value || investedAmount;
      const maturityDate = document.getElementById('maturityDate').value || '';
      const notes = document.getElementById('investmentNotes').value || '';

      // Calcular rentabilidade simulada
      const rentability = ((parseFloat(currentValue) / parseFloat(investedAmount) - 1) * 100).toFixed(2);
      const rentabilityClass = parseFloat(rentability) >= 0 ? 'text-success' : 'text-danger';
      const rentabilitySymbol = parseFloat(rentability) >= 0 ? '+' : '';

      // Formatar data para exibição
      const formattedDate = formatDate(acquisitionDate);

      // Criar nova linha para a tabela
      const table = document.querySelector('.table-hover tbody');
      if (table) {
        const newRow = document.createElement('tr');
        
        // Definir classe do badge com base no tipo de ativo
        let badgeClass = 'bg-label-primary';
        if (assetClass === 'renda_variavel') badgeClass = 'bg-label-danger';
        if (assetClass === 'fundos_imobiliarios') badgeClass = 'bg-label-warning';
        if (assetClass === 'cripto') badgeClass = 'bg-label-info';
        
        // Formatar nome da classe para exibição
        const assetClassNames = {
          'renda_fixa': 'Renda Fixa',
          'renda_variavel': 'Renda Variável',
          'fundos_imobiliarios': 'Fundos Imobiliários',
          'cripto': 'Cripto',
          'outros': 'Outros'
        };
        
        newRow.innerHTML = `
          <td>${assetName}</td>
          <td><span class="badge ${badgeClass}">${assetClassNames[assetClass]}</span></td>
          <td>R$ ${parseFloat(investedAmount).toFixed(2).replace('.', ',')}</td>
          <td>R$ ${parseFloat(currentValue).toFixed(2).replace('.', ',')}</td>
          <td><span class="${rentabilityClass}">${rentabilitySymbol}${rentability}%</span></td>
          <td>${formattedDate}</td>
          <td>
            <div class="dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-edit-alt me-1"></i> Editar</a>
                <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-trash me-1"></i> Excluir</a>
                <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-bar-chart-alt-2 me-1"></i> Desempenho</a>
              </div>
            </div>
          </td>
        `;
        
        table.prepend(newRow);
      }

      // Fechar o modal e limpar o formulário
      newInvestmentForm.reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById('addInvestmentModal'));
      if (modal) {
        modal.hide();
      }

      // Mostrar mensagem de sucesso
      alert('Investimento adicionado com sucesso!');
    });
  }

  // Função para formatar data
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }
});
