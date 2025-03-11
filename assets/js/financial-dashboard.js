
/**
 * Dashboard Financeiro - Javascript
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

  // Dados simulados que seriam obtidos de um backend real
  const mockFinancialData = {
    // Meses do ano
    months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    
    // Receitas mensais detalhadas por canal
    incomeByMonth: [4200, 3800, 5100, 4800, 7200, 8500, 9200, 8700, 10500, 11500, 12000, 12628],
    
    // Despesas mensais
    expensesByMonth: [2000, 1800, 2300, 2800, 3100, 3500, 3800, 3500, 4100, 4500, 4600, 4679],
    
    // Dados de receita por categoria
    incomeCategories: {
      labels: ['AdSense', 'Patrocínios', 'Afiliados', 'Serviços', 'Outros'],
      values: [4500, 3600, 1800, 2100, 950]
    },
    
    // Dados de despesa por categoria
    expenseCategories: {
      labels: ['Equipamento', 'Software', 'Serviços', 'Impostos', 'Outros'],
      values: [2800, 850, 680, 300, 450]
    },
    
    // Fluxo de caixa diário (últimos 30 dias)
    dailyCashFlow: {
      days: Array.from({length: 30}, (_, i) => i + 1),
      income: Array.from({length: 30}, () => Math.floor(Math.random() * 500) + 100),
      expense: Array.from({length: 30}, () => Math.floor(Math.random() * 300) + 50)
    },
    
    // Transações recentes
    recentTransactions: [
      {
        id: 1258,
        date: '12/06/2023',
        description: 'Pagamento de patrocínio',
        category: 'Receita',
        amount: 1200.00,
        status: 'Concluído',
        type: 'income'
      },
      {
        id: 1257,
        date: '10/06/2023',
        description: 'Equipamento de gravação',
        category: 'Despesa',
        amount: 750.00,
        status: 'Concluído',
        type: 'expense'
      },
      {
        id: 1256,
        date: '08/06/2023',
        description: 'Monetização YouTube',
        category: 'Receita',
        amount: 850.75,
        status: 'Concluído',
        type: 'income'
      },
      {
        id: 1255,
        date: '05/06/2023',
        description: 'Software de edição',
        category: 'Despesa',
        amount: 129.99,
        status: 'Concluído',
        type: 'expense'
      },
      {
        id: 1254,
        date: '01/06/2023',
        description: 'Patrocínio Instagram',
        category: 'Receita',
        amount: 500.00,
        status: 'Concluído',
        type: 'income'
      }
    ]
  };
  
  // Função para carregar dados - simulando conexão com backend
  const loadDashboardData = async () => {
    try {
      // Em um ambiente real, aqui seria uma chamada fetch para o backend
      // const response = await fetch('/api/financial/dashboard');
      // const data = await response.json();
      
      // Vamos simular uma resposta do backend usando os dados mocados
      return mockFinancialData;
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      return mockFinancialData; // Usar dados simulados em caso de erro
    }
  };

  // Inicialização do dashboard
  const initDashboard = async () => {
    const data = await loadDashboardData();
    renderFinancialChart(data);
    renderCategoryCharts(data);
    renderDailyCashFlowChart(data);
  };

  // Gráfico Financeiro - Receitas x Despesas
  const renderFinancialChart = (data) => {
    const financialChartEl = document.querySelector('#financialChart');
    if (financialChartEl) {
      // Calcular lucro (receitas - despesas)
      const profitData = data.incomeByMonth.map((income, index) => income - data.expensesByMonth[index]);
      
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
            data: data.incomeByMonth
          },
          {
            name: 'Despesas',
            type: 'column',
            data: data.expensesByMonth
          },
          {
            name: 'Lucro',
            type: 'line',
            data: profitData
          }
        ],
        stroke: {
          width: [0, 0, 3],
          curve: 'smooth'
        },
        colors: [successColor, dangerColor, primaryColor],
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
          colors: 'transparent',
          strokeColors: 'transparent',
          strokeWidth: 4,
          discrete: [],
          shape: 'circle',
          radius: 2,
          offsetX: 0,
          offsetY: 0,
          hover: {
            size: 7
          }
        },
        xaxis: {
          categories: data.months,
          labels: {
            style: {
              colors: labelColor
            }
          },
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
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
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'left',
          labels: {
            colors: labelColor
          },
          markers: {
            offsetX: -3
          },
          itemMargin: {
            horizontal: 10
          }
        },
        tooltip: {
          shared: true,
          y: {
            formatter: function(val) {
              return 'R$ ' + val.toFixed(2);
            }
          }
        }
      };

      const financialChart = new ApexCharts(financialChartEl, financialChartConfig);
      financialChart.render();
    }
  };

  // Gráficos de categorias
  const renderCategoryCharts = (data) => {
    // Gráfico de receitas por categoria
    const categoryChartEl = document.querySelector('#categoryChart');
    if (categoryChartEl) {
      const categoryChartConfig = {
        chart: {
          height: 300,
          type: 'donut'
        },
        labels: data.incomeCategories.labels,
        series: data.incomeCategories.values,
        colors: [primaryColor, successColor, warningColor, infoColor, config.colors.secondary],
        stroke: {
          width: 0
        },
        dataLabels: {
          enabled: true,
          formatter: function(val, opt) {
            return parseInt(val) + '%';
          }
        },
        legend: {
          show: true,
          position: 'bottom',
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
        }
      };

      const categoryChart = new ApexCharts(categoryChartEl, categoryChartConfig);
      categoryChart.render();
    }

    // Gráfico de despesas por categoria
    const expenseCategoryChartEl = document.querySelector('#expenseCategoryChart');
    if (expenseCategoryChartEl) {
      const expenseCategoryChartConfig = {
        chart: {
          height: 300,
          type: 'donut'
        },
        labels: data.expenseCategories.labels,
        series: data.expenseCategories.values,
        colors: [dangerColor, warningColor, infoColor, config.colors.secondary, config.colors.info],
        stroke: {
          width: 0
        },
        dataLabels: {
          enabled: true,
          formatter: function(val, opt) {
            return parseInt(val) + '%';
          }
        },
        legend: {
          show: true,
          position: 'bottom',
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
        }
      };

      const expenseCategoryChart = new ApexCharts(expenseCategoryChartEl, expenseCategoryChartConfig);
      expenseCategoryChart.render();
    }
  };

  // Gráfico de fluxo de caixa diário
  const renderDailyCashFlowChart = (data) => {
    const dailyCashFlowChartEl = document.querySelector('#dailyCashFlowChart');
    if (dailyCashFlowChartEl) {
      const dailyCashFlowChartConfig = {
        chart: {
          height: 300,
          type: 'area',
          parentHeightOffset: 0,
          toolbar: {
            show: false
          }
        },
        series: [
          {
            name: 'Receitas',
            data: data.dailyCashFlow.income
          },
          {
            name: 'Despesas',
            data: data.dailyCashFlow.expense
          }
        ],
        colors: [successColor, dangerColor],
        fill: {
          opacity: 0.9,
          type: 'gradient',
          gradient: {
            shade: 'dark',
            shadeIntensity: 0.5,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.6,
            opacityTo: 0.1,
            stops: [0, 95, 100]
          }
        },
        stroke: {
          width: 2,
          curve: 'smooth'
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'left',
          labels: {
            colors: labelColor
          }
        },
        markers: {
          size: 0,
          hover: {
            size: 5
          }
        },
        grid: {
          borderColor: borderColor,
          padding: {
            top: -20,
            bottom: -10,
            left: 0,
            right: 0
          }
        },
        xaxis: {
          categories: data.dailyCashFlow.days,
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
            style: {
              colors: labelColor
            },
            formatter: function(val) {
              return 'R$ ' + val.toFixed(0);
            }
          }
        },
        tooltip: {
          x: {
            show: false
          }
        }
      };

      const dailyCashFlowChart = new ApexCharts(dailyCashFlowChartEl, dailyCashFlowChartConfig);
      dailyCashFlowChart.render();
    }
  };

  // Inicializar o dashboard
  initDashboard();
});
