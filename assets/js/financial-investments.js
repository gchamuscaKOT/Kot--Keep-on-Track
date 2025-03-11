
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

  // Gráfico de Composição do Portfólio
  const portfolioCompositionEl = document.querySelector('#portfolioComposition');
  if (portfolioCompositionEl) {
    const portfolioCompositionConfig = {
      chart: {
        height: 300,
        type: 'pie',
        toolbar: {
          show: true
        }
      },
      series: [10000, 15700, 3500, 5000, 1650],
      labels: ['Renda Fixa', 'Renda Variável', 'Fundos Imobiliários', 'Ações', 'Criptomoedas'],
      colors: [
        config.colors.primary,
        config.colors.danger,
        config.colors.warning,
        config.colors.info,
        config.colors.success
      ],
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val.toFixed(1) + "%";
        }
      },
      legend: {
        position: 'bottom',
        markers: {
          offsetX: -3
        },
        labels: {
          colors: labelColor
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return 'R$ ' + value.toLocaleString('pt-BR', {minimumFractionDigits: 2});
          }
        }
      },
      responsive: [
        {
          breakpoint: 992,
          options: {
            chart: {
              height: 320
            },
            legend: {
              position: 'bottom'
            }
          }
        },
        {
          breakpoint: 576,
          options: {
            chart: {
              height: 280
            },
            legend: {
              position: 'bottom'
            },
            dataLabels: {
              enabled: false
            }
          }
        }
      ]
    };

    const portfolioComposition = new ApexCharts(portfolioCompositionEl, portfolioCompositionConfig);
    portfolioComposition.render();
  }

  // Gráfico de Desempenho por Classe de Ativo
  const assetClassPerformanceEl = document.querySelector('#assetClassPerformance');
  if (assetClassPerformanceEl) {
    const assetClassPerformanceConfig = {
      chart: {
        height: 300,
        type: 'bar',
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 3
        }
      },
      series: [
        {
          name: 'Rentabilidade (%)',
          data: [8.5, 5.2, 7.0, -2.3, 10.0]
        }
      ],
      colors: [config.colors.primary],
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: ['Renda Fixa', 'Renda Variável', 'Fundos Imobiliários', 'Ações', 'Criptomoedas'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: labelColor
          }
        }
      },
      yaxis: {
        title: {
          text: 'Rentabilidade (%)',
          style: {
            fontSize: '14px',
            fontFamily: 'Public Sans',
            color: headingColor
          }
        },
        labels: {
          style: {
            colors: labelColor
          }
        }
      },
      grid: {
        borderColor: borderColor
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val + '%';
          }
        }
      }
    };

    const assetClassPerformance = new ApexCharts(assetClassPerformanceEl, assetClassPerformanceConfig);
    assetClassPerformance.render();
  }

  // Evento para salvar novo investimento
  const saveInvestmentBtn = document.getElementById('saveInvestment');
  if (saveInvestmentBtn) {
    saveInvestmentBtn.addEventListener('click', function() {
      const form = document.getElementById('newInvestmentForm');
      
      // Verificar se todos os campos obrigatórios estão preenchidos
      if (form.checkValidity()) {
        // Em uma aplicação real, enviaria os dados para o servidor
        alert('Investimento adicionado com sucesso!');
        
        // Fechar o modal e limpar o formulário
        const modal = bootstrap.Modal.getInstance(document.getElementById('addInvestmentModal'));
        modal.hide();
        form.reset();
      } else {
        // Forçar validação do formulário
        form.reportValidity();
      }
    });
  }
});
