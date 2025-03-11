
/**
 * Dashboard Financeiro - KOT (Keep on Track)
 */

'use strict';

(function () {
  let cardColor, headingColor, labelColor, borderColor, legendColor;

  if (isDarkStyle) {
    cardColor = config.colors_dark.cardColor;
    headingColor = config.colors_dark.headingColor;
    labelColor = config.colors_dark.textMuted;
    legendColor = config.colors_dark.bodyColor;
    borderColor = config.colors_dark.borderColor;
  } else {
    cardColor = config.colors.cardColor;
    headingColor = config.colors.headingColor;
    labelColor = config.colors.textMuted;
    legendColor = config.colors.bodyColor;
    borderColor = config.colors.borderColor;
  }

  // Gráfico Financeiro - Receitas x Despesas
  // --------------------------------------------------------------------
  const financialChartEl = document.querySelector('#financialChart');
  if (financialChartEl) {
    const financialChartConfig = {
      chart: {
        height: 400,
        type: 'line',
        stacked: false,
        parentHeightOffset: 0,
        toolbar: {
          show: true
        }
      },
      series: [
        {
          name: 'Receitas',
          type: 'column',
          data: [4200, 3800, 5100, 4800, 7200, 8500, 9200, 8700, 10500, 11500, 12000, 12628]
        },
        {
          name: 'Despesas',
          type: 'column',
          data: [2000, 1800, 2300, 2800, 3100, 3500, 3800, 3500, 4100, 4500, 4600, 4679]
        },
        {
          name: 'Lucro',
          type: 'line',
          data: [2200, 2000, 2800, 2000, 4100, 5000, 5400, 5200, 6400, 7000, 7400, 7949]
        }
      ],
      stroke: {
        width: [0, 0, 3],
        curve: 'smooth'
      },
      colors: [config.colors.success, config.colors.danger, config.colors.primary],
      grid: {
        borderColor: borderColor,
        padding: {
          top: -20,
          bottom: -10,
          left: 0,
          right: 0
        }
      },
      markers: {
        size: 6,
        strokeColors: cardColor,
        strokeWidth: 3,
        strokeOpacity: 1,
        fillOpacity: 1,
        hover: {
          size: 8
        }
      },
      xaxis: {
        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
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
          text: 'Valores (R$)',
          style: {
            fontSize: '13px',
            colors: legendColor
          }
        },
        labels: {
          formatter: function (val) {
            return 'R$ ' + val.toLocaleString('pt-BR');
          },
          style: {
            colors: labelColor
          }
        }
      },
      legend: {
        position: 'top',
        fontSize: '13px',
        markers: {
          size: 10,
          radius: 10
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0
        },
        labels: {
          colors: legendColor
        }
      },
      fill: {
        opacity: [0.85, 0.85, 1],
        gradient: {
          inverseColors: false,
          shade: 'light',
          type: 'vertical',
          opacityFrom: 0.85,
          opacityTo: 0.55
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return 'R$ ' + val.toLocaleString('pt-BR');
          }
        }
      }
    };

    const financialChart = new ApexCharts(financialChartEl, financialChartConfig);
    financialChart.render();
  }

  // Distribuição de Receitas por Canal
  // --------------------------------------------------------------------
  const revenueDistributionEl = document.querySelector('#revenueDistributionChart');
  if (revenueDistributionEl) {
    const revenueDistributionConfig = {
      chart: {
        type: 'donut',
        height: 250,
        parentHeightOffset: 0,
        toolbar: {
          show: false
        }
      },
      labels: ['YouTube', 'Instagram', 'TikTok', 'Outros'],
      series: [45, 30, 20, 5],
      colors: [config.colors.danger, config.colors.primary, config.colors.info, config.colors.secondary],
      stroke: {
        width: 0
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'bottom',
        markers: { offsetX: -3 },
        fontSize: '13px',
        labels: {
          colors: legendColor
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: {
                offsetY: 15,
                color: legendColor
              },
              value: {
                offsetY: -15,
                fontSize: '22px',
                fontWeight: '500',
                color: headingColor,
                formatter: function (val) {
                  return val + '%';
                }
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '13px',
                color: legendColor,
                formatter: function () {
                  return '100%';
                }
              }
            }
          }
        }
      }
    };

    const revenueDistributionChart = new ApexCharts(revenueDistributionEl, revenueDistributionConfig);
    revenueDistributionChart.render();
  }

  // Tendência de Crescimento Mensal
  // --------------------------------------------------------------------
  const growthTrendEl = document.querySelector('#growthTrendChart');
  if (growthTrendEl) {
    const growthTrendConfig = {
      chart: {
        height: 220,
        type: 'area',
        parentHeightOffset: 0,
        toolbar: {
          show: false
        }
      },
      series: [
        {
          name: 'Crescimento',
          data: [38, 45, 42, 50, 58, 62, 55, 65, 67, 72, 75, 80]
        }
      ],
      stroke: {
        curve: 'smooth'
      },
      dataLabels: {
        enabled: false
      },
      colors: [config.colors.success],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.8,
          opacityFrom: 0.8,
          opacityTo: 0.3
        }
      },
      grid: {
        borderColor: borderColor,
        padding: {
          top: -15,
          bottom: -10,
          left: 0,
          right: 0
        }
      },
      xaxis: {
        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        labels: {
          style: {
            colors: labelColor
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val + '%';
          },
          style: {
            colors: labelColor
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + '%';
          }
        }
      }
    };

    const growthTrendChart = new ApexCharts(growthTrendEl, growthTrendConfig);
    growthTrendChart.render();
  }

  // Histórico de Transações - Inicialização da Tabela
  // --------------------------------------------------------------------
  const transactionHistoryTable = document.querySelector('#transactionHistoryTable');
  if (transactionHistoryTable) {
    // Aqui poderia ser adicionada a inicialização de uma biblioteca de tabelas como DataTables
    console.log('Tabela de histórico de transações inicializada');
  }

  // Event Listeners para as Funcionalidades do Dashboard
  // --------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    // Botão para alternar períodos
    const periodSwitchers = document.querySelectorAll('.period-switch');
    if (periodSwitchers.length > 0) {
      periodSwitchers.forEach(switcher => {
        switcher.addEventListener('click', function (e) {
          e.preventDefault();
          const period = this.dataset.period;
          console.log('Alternando para período:', period);
          // Aqui poderia ser implementada a lógica para atualizar os gráficos com base no período
        });
      });
    }

    // Inicialização de tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  });
})();
