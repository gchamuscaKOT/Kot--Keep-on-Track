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
        labels: {
          style: {
            colors: labelColor
          },
          formatter: function(val) {
            return 'R$ ' + val.toLocaleString('pt-BR', {maximumFractionDigits: 0});
          }
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function(y) {
            if (typeof y !== 'undefined') {
              return 'R$ ' + y.toLocaleString('pt-BR', {minimumFractionDigits: 2});
            }
            return y;
          }
        }
      },
      legend: {
        labels: {
          colors: legendColor
        },
        position: 'top',
        horizontalAlign: 'right'
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


  /**
   * Financial Dashboard - Javascript
   */

  // Configuração Global
  const primaryColor = config.colors.primary;
  const successColor = config.colors.success;
  const dangerColor = config.colors.danger;
  const warningColor = config.colors.warning;
  const infoColor = config.colors.info;

  // Dados para o gráfico de fluxo de caixa
  const financialChartEl2 = document.querySelector('#financialChart');
  if (financialChartEl2) {
    const financialChartConfig2 = {
      chart: {
        height: 400,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      series: [
        {
          name: 'Receitas',
          type: 'column',
          data: [4500, 5200, 4800, 5900, 6800, 7200, 8100, 7400, 9100, 8700, 9600, 12628]
        },
        {
          name: 'Despesas',
          type: 'column',
          data: [2800, 2900, 2700, 3200, 3800, 3500, 3900, 3600, 4100, 4300, 4200, 4679]
        },
        {
          name: 'Saldo',
          type: 'line',
          data: [1700, 2300, 2100, 2700, 3000, 3700, 4200, 3800, 5000, 4400, 5400, 7949]
        }
      ],
      colors: [primaryColor, dangerColor, successColor],
      stroke: {
        curve: 'smooth',
        width: [0, 0, 3]
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        fontFamily: 'Public Sans',
        markers: {
          height: 12,
          width: 12,
          radius: 12,
          offsetX: -3
        },
        labels: {
          colors: labelColor
        },
        itemMargin: {
          horizontal: 15
        }
      },
      grid: {
        borderColor: borderColor,
        padding: {
          top: 0,
          bottom: -8,
          left: 20,
          right: 20
        }
      },
      xaxis: {
        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        labels: {
          style: {
            fontSize: '13px',
            colors: labelColor,
            fontFamily: 'Public Sans'
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
            fontSize: '13px',
            colors: labelColor,
            fontFamily: 'Public Sans'
          },
          formatter: function(val) {
            return 'R$ ' + val.toFixed(0);
          }
        }
      },
      responsive: [
        {
          breakpoint: 1700,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '32%'
              }
            }
          }
        },
        {
          breakpoint: 1580,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '35%'
              }
            }
          }
        },
        {
          breakpoint: 1440,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '42%'
              }
            }
          }
        },
        {
          breakpoint: 1300,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '48%'
              }
            }
          }
        },
        {
          breakpoint: 1200,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '40%'
              }
            }
          }
        },
        {
          breakpoint: 1040,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 11,
                columnWidth: '48%'
              }
            }
          }
        },
        {
          breakpoint: 991,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '30%'
              }
            }
          }
        },
        {
          breakpoint: 840,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '35%'
              }
            }
          }
        },
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '28%'
              }
            }
          }
        },
        {
          breakpoint: 640,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '32%'
              }
            }
          }
        },
        {
          breakpoint: 576,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '37%'
              }
            }
          }
        },
        {
          breakpoint: 480,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '45%'
              }
            }
          }
        },
        {
          breakpoint: 420,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '52%'
              }
            }
          }
        },
        {
          breakpoint: 380,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '60%'
              }
            }
          }
        }
      ],
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      },
      title: {
        text: 'Fluxo de Caixa 2023',
        align: 'left',
        style: {
          fontSize: '14px',
          color: headingColor,
          fontFamily: 'Public Sans'
        }
      },
      subtitle: {
        text: 'Análise mensal de receitas, despesas e saldo',
        align: 'left',
        style: {
          fontSize: '12px',
          color: labelColor,
          fontFamily: 'Public Sans'
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function(value) {
            return 'R$ ' + value.toFixed(2);
          }
        }
      }
    };

    const financialChart2 = new ApexCharts(financialChartEl2, financialChartConfig2);
    financialChart2.render();

    // Adicionar categoria por gráfico (pizza)
    const categoryChartEl = document.querySelector('#categoryChart');
    if (categoryChartEl) {
      const categoryChartConfig = {
        chart: {
          height: 300,
          type: 'donut'
        },
        labels: ['AdSense', 'Patrocínios', 'Afiliados', 'Serviços', 'Outros'],
        series: [4500, 3600, 1800, 2100, 950],
        colors: [primaryColor, successColor, warningColor, infoColor, config.colors.secondary],
        stroke: {
          width: 0
        },
        dataLabels: {
          enabled: false,
          formatter: function(val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ': ' + val + '%';
          }
        },
        legend: {
          show: true,
          position: 'bottom',
          fontFamily: 'Public Sans',
          labels: {
            colors: labelColor
          }
        },
        title: {
          text: 'Receitas por Categoria',
          align: 'center',
          style: {
            fontSize: '14px',
            color: headingColor,
            fontFamily: 'Public Sans'
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

    // Adicionar gráfico de despesas por categoria 
    const expenseCategoryChartEl = document.querySelector('#expenseCategoryChart');
    if (expenseCategoryChartEl) {
      const expenseCategoryChartConfig = {
        chart: {
          height: 300,
          type: 'donut'
        },
        labels: ['Equipamentos', 'Software', 'Impostos', 'Marketing', 'Outros'],
        series: [1800, 950, 780, 650, 490],
        colors: [dangerColor, warningColor, infoColor, config.colors.secondary, config.colors.info],
        stroke: {
          width: 0
        },
        dataLabels: {
          enabled: false,
          formatter: function(val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ': ' + val + '%';
          }
        },
        legend: {
          show: true,
          position: 'bottom',
          fontFamily: 'Public Sans',
          labels: {
            colors: labelColor
          }
        },
        title: {
          text: 'Despesas por Categoria',
          align: 'center',
          style: {
            fontSize: '14px',
            color: headingColor,
            fontFamily: 'Public Sans'
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
  }

  // Atualização dinâmica dos cards de informação
  const updateStatistics = () => {
    // Esta função poderia conectar-se ao backend para obter dados atualizados em tempo real
    console.log('Estatísticas atualizadas');
  };

  // Atualizar estatísticas a cada 30 segundos
  setInterval(updateStatistics, 30000);

  // Função para carregar dados do backend
  const loadDashboardData = async () => {
    try {
      // Obter o período atual (mês atual por padrão)
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];

      // Fazer requisição para o backend
      const response = await fetch(`/api/transactions/summary?start_date=${startDate}&end_date=${endDate}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar dados do dashboard');
      }

      const data = await response.json();
      updateDashboardCards(data);
      updateFinancialChart(data);
      updateCategoryCharts(data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      // Usar dados estáticos para demonstração se o backend falhar
      loadDemoData();
    }
  };

  // Atualizar cards do dashboard
  const updateDashboardCards = (data) => {
    // Se temos dados reais
    if (data && data.summary) {
      document.querySelector('#totalIncome').textContent = `R$ ${data.summary.income.toFixed(2).replace('.', ',')}`;
      document.querySelector('#totalExpenses').textContent = `R$ ${data.summary.expense.toFixed(2).replace('.', ',')}`;
      document.querySelector('#totalProfit').textContent = `R$ ${data.summary.balance.toFixed(2).replace('.', ',')}`;

      // Adicionar percentuais de crescimento
      if (data.growth) {
        document.querySelector('#incomeGrowth').textContent = `${data.growth.income > 0 ? '+' : ''}${data.growth.income.toFixed(2)}%`;
        document.querySelector('#expenseGrowth').textContent = `${data.growth.expense > 0 ? '+' : ''}${data.growth.expense.toFixed(2)}%`;
        document.querySelector('#profitGrowth').textContent = `${data.growth.balance > 0 ? '+' : ''}${data.growth.balance.toFixed(2)}%`;
        document.querySelector('#overallGrowth').textContent = `${data.growth.overall > 0 ? '+' : ''}${data.growth.overall.toFixed(2)}%`;

        // Ajustar classes para indicar crescimento positivo/negativo
        document.querySelector('#incomeGrowth').className = data.growth.income >= 0 ? 'text-success fw-semibold' : 'text-danger fw-semibold';
        document.querySelector('#expenseGrowth').className = data.growth.expense <= 0 ? 'text-success fw-semibold' : 'text-danger fw-semibold';
        document.querySelector('#profitGrowth').className = data.growth.balance >= 0 ? 'text-success fw-semibold' : 'text-danger fw-semibold';
        document.querySelector('#overallGrowth').className = data.growth.overall >= 0 ? 'text-success fw-semibold' : 'text-danger fw-semibold';
      }
    }
  };

  // Gráfico Financeiro - Receitas x Despesas
  const updateFinancialChart = (data) => {
    const financialChartEl = document.querySelector('#financialChart');
    if (financialChartEl) {
      // Usar dados da API se disponíveis, ou dados de demonstração
      let months, incomeData, expenseData, profitData;

      if (data && data.monthly) {
        months = data.monthly.map(item => item.month);
        incomeData = data.monthly.map(item => item.income);
        expenseData = data.monthly.map(item => item.expense);
        profitData = data.monthly.map(item => item.balance);
      } else {
        // Dados de demonstração
        months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        incomeData = [4200, 3800, 5100, 4800, 7200, 8500, 9200, 8700, 10500, 11500, 12000, 12628];
        expenseData = [2000, 1800, 2300, 2800, 3100, 3500, 3800, 3500, 4100, 4500, 4600, 4679];
        profitData = incomeData.map((income, index) => income - expenseData[index]);
      }

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
            data: incomeData
          },
          {
            name: 'Despesas',
            type: 'column',
            data: expenseData
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
            formatter: function (value) {
              return 'R$ ' + value.toFixed(0);
            }
          }
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (y) {
              if (typeof y !== 'undefined') {
                return 'R$ ' + y.toFixed(2).replace('.', ',');
              }
              return y;
            }
          }
        },
        legend: {
          labels: {
            colors: legendColor
          },
          position: 'top',
          horizontalAlign: 'right'
        }
      };

      const financialChart = new ApexCharts(financialChartEl, financialChartConfig);
      financialChart.render();
    }
  };

  // Gráficos de categorias
  const updateCategoryCharts = (data) => {
    // Dados para o gráfico de categorias
    let incomeCategories = [], incomeValues = [];
    let expenseCategories = [], expenseValues = [];

    if (data && data.categories) {
      // Separar categorias de receita e despesa
      data.categories.forEach(cat => {
        if (cat.type === 'income') {
          incomeCategories.push(cat.name);
          incomeValues.push(cat.total);
        } else {
          expenseCategories.push(cat.name);
          expenseValues.push(cat.total);
        }
      });
    } else {
      // Dados de demonstração
      incomeCategories = ['AdSense', 'Patrocínio', 'Afiliados', 'Vendas'];
      incomeValues = [5600, 4200, 1800, 1000];

      expenseCategories = ['Equipamento', 'Software', 'Serviços', 'Impostos'];
      expenseValues = [2300, 1200, 800, 400];
    }

    // Gráfico de categorias de receita
    const incomeCategoryEl = document.querySelector('#incomeCategoryChart');
    if (incomeCategoryEl) {
      const incomeCategoryConfig = {
        chart: {
          height: 300,
          type: 'pie',
        },
        labels: incomeCategories,
        series: incomeValues,
        colors: [
          config.colors.primary,
          config.colors.info,
          config.colors.success,
          config.colors.secondary
        ],
        stroke: {
          width: 0
        },
        legend: {
          position: 'bottom',
          labels: {
            colors: legendColor
          }
        }
      };

      const incomeCategoryChart = new ApexCharts(incomeCategoryEl, incomeCategoryConfig);
      incomeCategoryChart.render();
    }

    // Gráfico de categorias de despesa
    const expenseCategoryEl = document.querySelector('#expenseCategoryChart');
    if (expenseCategoryEl) {
      const expenseCategoryConfig = {
        chart: {
          height: 300,
          type: 'pie',
        },
        labels: expenseCategories,
        series: expenseValues,
        colors: [
          config.colors.danger,
          config.colors.warning,
          config.colors.dark,
          config.colors.gray
        ],
        stroke: {
          width: 0
        },
        legend: {
          position: 'bottom',
          labels: {
            colors: legendColor
          }
        }
      };

      const expenseCategoryChart = new ApexCharts(expenseCategoryEl, expenseCategoryConfig);
      expenseCategoryChart.render();
    }
  };

  // Carregar dados de demonstração (quando o backend não está disponível)
  const loadDemoData = () => {
    // Dados estáticos para demonstração
    const demoData = {
      summary: {
        income: 12628,
        expense: 4679,
        balance: 7949
      },
      growth: {
        income: 12.8,
        expense: -5.2,
        balance: 28.42,
        overall: 18.5
      },
      monthly: [
        { month: 'Jan', income: 4200, expense: 2000, balance: 2200 },
        { month: 'Fev', income: 3800, expense: 1800, balance: 2000 },
        { month: 'Mar', income: 5100, expense: 2300, balance: 2800 },
        { month: 'Abr', income: 4800, expense: 2800, balance: 2000 },
        { month: 'Mai', income: 7200, expense: 3100, balance: 4100 },
        { month: 'Jun', income: 8500, expense: 3500, balance: 5000 },
        { month: 'Jul', income: 9200, expense: 3800, balance: 5400 },
        { month: 'Ago', income: 8700, expense: 3500, balance: 5200 },
        { month: 'Set', income: 10500, expense: 4100, balance: 6400 },
        { month: 'Out', income: 11500, expense: 4500, balance: 7000 },
        { month: 'Nov', income: 12000, expense: 4600, balance: 7400 },
        { month: 'Dez', income: 12628, expense: 4679, balance: 7949 }
      ],
      categories: [
        { name: 'AdSense', type: ''income', total: 5628 },
        { name: 'Patrocínio', type: 'income', total: 4200 },
        { name: 'Afiliados', type: 'income', total: 1800 },
        { name: 'Vendas', type: 'income', total: 1000 },
        { name: 'Equipamento', type: 'expense', total: 2300 },
        { name: 'Software', type: 'expense', total: 1200 },
        { name: 'Serviços', type: 'expense', total: 800 },
        { name: 'Impostos', type: 'expense', total: 379 }
      ]
    };

    updateDashboardCards(demoData);
    updateFinancialChart(demoData);
    updateCategoryCharts(demoData);
  };

  // Carregar as transações recentes
  const loadRecentTransactions = async () => {
    try {
      const response = await fetch('/api/transactions?limit=5');
      if (!response.ok) {
        throw new Error('Erro ao carregar transações recentes');
      }

      const data = await response.json();
      updateRecentTransactionsTable(data.transactions);
    } catch (error) {
      console.error('Erro ao carregar transações recentes:', error);
      // Manter os dados de demonstração existentes na tabela
    }
  };

  // Atualizar tabela de transações recentes
  const updateRecentTransactionsTable = (transactions) => {
    const tableBody = document.querySelector('#recentTransactionsTable tbody');
    if (!tableBody) return;

    if (transactions && transactions.length > 0) {
      tableBody.innerHTML = '';

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

        // Construir a linha
        row.innerHTML = `
          <td>${icon} #${transaction.id.substring(0, 4)}</td>
          <td>${date}</td>
          <td>${transaction.description}</td>
          <td>${transaction.category ? transaction.category.name : type}</td>
          <td><strong class="${amountClass}">${amount}</strong></td>
          <td>${status}</td>
          <td>
            <div class="dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="financial-transactions.html?edit=${transaction.id}">
                  <i class="bx bx-edit-alt me-1"></i> Editar
                </a>
                <a class="dropdown-item" href="javascript:deleteTransaction('${transaction.id}');">
                  <i class="bx bx-trash me-1"></i> Excluir
                </a>
              </div>
            </div>
          </td>
        `;

        tableBody.appendChild(row);
      });
    }
  };

  // Event Listeners para as Funcionalidades do Dashboard
  const setupEventListeners = () => {
    // Botão para alternar períodos
    const periodSwitchers = document.querySelectorAll('.period-switch');
    if (periodSwitchers.length > 0) {
      periodSwitchers.forEach(switcher => {
        switcher.addEventListener('click', function (e) {
          e.preventDefault();
          const period = this.dataset.period;
          console.log('Alternando para período:', period);
          // Implementar lógica para atualizar os gráficos com base no período
        });
      });
    }
  };

  // Inicializar o dashboard
  const initDashboard = () => {
    loadDashboardData();
    loadRecentTransactions();
    setupEventListeners();
  };

  // Iniciar o dashboard quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
});