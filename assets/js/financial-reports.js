/**
 * Relatórios Financeiros - Javascript
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Configuração Global
  const cardColor = config.colors.cardColor;
  const headingColor = config.colors.headingColor;
  const labelColor = config.colors.textMuted;
  const legendColor = config.colors.bodyColor;
  const borderColor = config.colors.borderColor;
  const primaryColor = config.colors.primary;
  const successColor = config.colors.success;
  const dangerColor = config.colors.danger;
  const warningColor = config.colors.warning;
  const infoColor = config.colors.info;

  // Definir o tema (necessário para resolver o erro isDarkStyle)
  const isDarkStyle = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Dados simulados que seriam obtidos de um backend real
  const mockReportsData = {
    // Dados de desempenho financeiro mensal
    monthly: [
      { month: 'Jan', income: 5200, expense: 3800 },
      { month: 'Fev', income: 4700, expense: 3600 },
      { month: 'Mar', income: 5600, expense: 4100 },
      { month: 'Abr', income: 6200, expense: 3900 },
      { month: 'Mai', income: 7100, expense: 4200 },
      { month: 'Jun', income: 9800, expense: 5300 }
    ],

    // Dados de receita por categoria
    incomeByCategory: {
      labels: ['AdSense', 'Patrocínio', 'Programa de Afiliados', 'Venda Direta'],
      values: [33.3, 38.7, 21.9, 6.1]
    },

    // Dados de despesa por categoria
    expensesByCategory: {
      labels: ['Equipamento', 'Software', 'Serviços', 'Impostos'],
      values: [52.1, 18.9, 20.8, 8.2]
    },

    // Dados de receita por canal
    revenueByChannel: {
      labels: ['YouTube', 'Instagram', 'TikTok'],
      values: [40.7, 32.4, 26.9]
    },

    // Dados de crescimento por canal
    growthByChannel: [
      { channel: 'YouTube', current: 15780, previous: 13350, growth: 18.2 },
      { channel: 'Instagram', current: 12560, previous: 9985, growth: 25.8 },
      { channel: 'TikTok', current: 10418, previous: 7320, growth: 42.3 }
    ]
  };

  // Função para carregar dados - simulando conexão com backend
  const loadReportsData = async () => {
    try {
      // Em um ambiente real, aqui seria uma chamada fetch para o backend
      // const response = await fetch('/api/financial/reports');
      // const data = await response.json();

      // Vamos simular uma resposta do backend usando os dados mocados
      return mockReportsData;
    } catch (error) {
      console.error('Erro ao carregar dados de relatórios:', error);
      return mockReportsData; // Usar dados simulados em caso de erro
    }
  };

  // Inicialização da página de relatórios
  const initReports = async () => {
    // Configurar listeners de eventos para formulário de filtros
    setupFilterListeners();

    // Carregar e renderizar dados
    const data = await loadReportsData();
    renderFinancialReportChart(data.monthly);
    renderIncomeByCategoryChart(data.incomeByCategory);
    renderExpensesByCategoryChart(data.expensesByCategory);
    renderRevenueByChannelChart(data.revenueByChannel);
    renderGrowthComparisonChart(data.growthByChannel);
  };

  // Configurar listeners para o formulário de filtros
  const setupFilterListeners = () => {
    const reportPeriodSelect = document.getElementById('reportPeriod');
    const customDateFields = document.querySelectorAll('.custom-date');

    if (reportPeriodSelect) {
      reportPeriodSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
          customDateFields.forEach(field => field.classList.remove('d-none'));
        } else {
          customDateFields.forEach(field => field.classList.add('d-none'));
        }
      });
    }

    const filterForm = document.getElementById('filterReports');
    if (filterForm) {
      filterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aqui seria feita uma chamada para recarregar os dados com os filtros
        console.log('Gerando relatório com filtros...');
        // Simulação de espera por carregamento
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Gerar Relatório';
          // Recarregar dados simulados
          initReports();
        }, 1500);
      });
    }
  };

  // Gráfico de Relatório Financeiro - Receitas x Despesas
  const renderFinancialReportChart = (monthlyData) => {
    const financialReportChartEl = document.querySelector('#financialReportChart');
    if (financialReportChartEl) {
      // Preparar dados para o gráfico
      const months = monthlyData.map(item => item.month);
      const incomeData = monthlyData.map(item => item.income);
      const expenseData = monthlyData.map(item => item.expense);

      const financialReportChartConfig = {
        chart: {
          height: 400,
          type: 'bar',
          stacked: false,
          parentHeightOffset: 0,
          toolbar: {
            show: true
          }
        },
        series: [
          {
            name: 'Receitas',
            data: incomeData
          },
          {
            name: 'Despesas',
            data: expenseData
          }
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 4
          }
        },
        colors: [successColor, dangerColor],
        grid: {
          borderColor: borderColor,
          padding: {
            top: -20,
            bottom: -10,
            left: 0,
            right: 0
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: months,
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
          labels: {
            style: {
              colors: labelColor
            },
            formatter: function(val) {
              return 'R$ ' + val.toFixed(0);
            }
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return 'R$ ' + val.toFixed(2);
            }
          }
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'left',
          labels: {
            colors: legendColor
          },
          markers: {
            offsetX: -3
          },
          itemMargin: {
            horizontal: 10
          }
        }
      };

      const financialReportChart = new ApexCharts(financialReportChartEl, financialReportChartConfig);
      financialReportChart.render();
    }
  };

  // Gráfico de Pizza - Receitas por Categoria
  const renderIncomeByCategoryChart = (data) => {
    const incomeByCategoryEl = document.querySelector('#incomeByCategory');
    if (incomeByCategoryEl) {
      const incomeByCategoryConfig = {
        chart: {
          type: 'pie',
          height: 300,
          parentHeightOffset: 0,
          toolbar: {
            show: false
          }
        },
        labels: data.labels,
        series: data.values,
        colors: [
          '#a5d6a7', // Verde pastel
          '#bbdefb', // Azul pastel
          '#d1c4e9', // Roxo pastel
          '#ffecb3'  // Amarelo pastel
        ],
        stroke: {
          width: 0
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(1) + '%';
          }
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
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toFixed(1) + '%';
            }
          }
        }
      };

      const incomeByCategoryChart = new ApexCharts(incomeByCategoryEl, incomeByCategoryConfig);
      incomeByCategoryChart.render();
    }
  };

  // Gráfico de Pizza - Despesas por Categoria
  const renderExpensesByCategoryChart = (data) => {
    const expensesByCategoryEl = document.querySelector('#expensesByCategory');
    if (expensesByCategoryEl) {
      const expensesByCategoryConfig = {
        chart: {
          type: 'pie',
          height: 300,
          parentHeightOffset: 0,
          toolbar: {
            show: false
          }
        },
        labels: data.labels,
        series: data.values,
        colors: [
          '#ffccbc', // Vermelho pastel
          '#fff9c4', // Amarelo pastel
          '#c5cae9', // Azul pastel
          '#dcedc8'  // Verde pastel
        ],
        stroke: {
          width: 0
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val.toFixed(1) + '%';
          }
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
        tooltip: {
          y: {
            formatter: function (val) {
              return val.toFixed(1) + '%';
            }
          }
        }
      };

      const expensesByCategoryChart = new ApexCharts(expensesByCategoryEl, expensesByCategoryConfig);
      expensesByCategoryChart.render();
    }
  };

  // Gráfico de Barras - Receitas por Canal
  const renderRevenueByChannelChart = (data) => {
    const revenueByChannelEl = document.querySelector('#revenueByChannel');
    if (revenueByChannelEl) {
      const revenueByChannelConfig = {
        chart: {
          type: 'bar',
          height: 300,
          parentHeightOffset: 0,
          toolbar: {
            show: false
          }
        },
        series: [{
          name: 'Receita',
          data: data.values
        }],
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 4,
            columnWidth: '60%'
          }
        },
        colors: ['#ff5252', '#448aff', '#212121'],
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        xaxis: {
          categories: data.labels,
          labels: {
            style: {
              colors: labelColor
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: labelColor
            },
            formatter: function(val) {
              return val.toFixed(1) + '%';
            }
          }
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val.toFixed(1) + '%';
            }
          }
        }
      };

      const revenueByChannelChart = new ApexCharts(revenueByChannelEl, revenueByChannelConfig);
      revenueByChannelChart.render();
    }
  };

  // Gráfico de Crescimento
  const renderGrowthComparisonChart = (data) => {
    const growthComparisonEl = document.querySelector('#growthComparison');
    if (growthComparisonEl) {
      // Preparar dados para o gráfico
      const channels = data.map(item => item.channel);
      const growthValues = data.map(item => item.growth);

      const growthComparisonConfig = {
        chart: {
          type: 'radar',
          height: 300,
          parentHeightOffset: 0,
          toolbar: {
            show: false
          },
          dropShadow: {
            enabled: false
          }
        },
        series: [{
          name: 'Crescimento (%)',
          data: growthValues
        }],
        stroke: {
          width: 2
        },
        fill: {
          opacity: 0.2
        },
        markers: {
          size: 5
        },
        colors: [primaryColor],
        xaxis: {
          categories: channels,
          labels: {
            style: {
              colors: Array(channels.length).fill(labelColor)
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: labelColor
            },
            formatter: function(val) {
              return val.toFixed(1) + '%';
            }
          }
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return val.toFixed(1) + '%';
            }
          }
        }
      };

      const growthComparisonChart = new ApexCharts(growthComparisonEl, growthComparisonConfig);
      growthComparisonChart.render();
    }
  };

  // Inicializar os relatórios
  initReports();
});