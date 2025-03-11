
/**
 * Relatórios Financeiros - KOT (Keep on Track)
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

  // Gráfico de Relatório Financeiro - Receitas x Despesas
  // --------------------------------------------------------------------
  const financialReportChartEl = document.querySelector('#financialReportChart');
  if (financialReportChartEl) {
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
          data: [5800, 6300, 6800, 6200, 7500, 8200]
        },
        {
          name: 'Despesas',
          data: [3200, 3400, 2800, 3100, 2900, 2800]
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        }
      },
      colors: [config.colors.success, config.colors.danger],
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
        categories: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
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
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return 'R$ ' + val.toLocaleString('pt-BR');
          }
        }
      }
    };

    const financialReportChart = new ApexCharts(financialReportChartEl, financialReportChartConfig);
    financialReportChart.render();
  }

  // Gráfico de Pizza - Receitas por Categoria
  // --------------------------------------------------------------------
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
      labels: ['AdSense', 'Patrocínio', 'Programa de Afiliados', 'Venda Direta'],
      series: [33.3, 38.7, 21.9, 6.1],
      colors: [
        config.colors.success,
        config.colors.primary,
        config.colors.info,
        config.colors.secondary
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

  // Gráfico de Pizza - Despesas por Categoria
  // --------------------------------------------------------------------
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
      labels: ['Equipamento', 'Software', 'Serviços', 'Impostos'],
      series: [52.1, 18.9, 20.8, 8.2],
      colors: [
        config.colors.danger,
        config.colors.warning,
        config.colors.info,
        config.colors.dark
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

  // Gráfico de Barras - Receitas por Canal
  // --------------------------------------------------------------------
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
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '60%',
          borderRadius: 4
        }
      },
      series: [{
        name: 'Receita',
        data: [15780.25, 12560.95, 10418.00]
      }],
      colors: [config.colors.primary],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return 'R$ ' + val.toLocaleString('pt-BR');
        },
        textAnchor: 'start',
        style: {
          colors: ['#fff']
        },
        offsetX: 0
      },
      xaxis: {
        categories: ['YouTube', 'Instagram', 'TikTok'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
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
      yaxis: {
        labels: {
          style: {
            colors: labelColor
          }
        }
      },
      grid: {
        borderColor: borderColor,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: -18,
          left: 0,
          right: 0,
          bottom: 0
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

    const revenueByChannelChart = new ApexCharts(revenueByChannelEl, revenueByChannelConfig);
    revenueByChannelChart.render();
  }

  // Gráfico de Linha - Comparação de Crescimento
  // --------------------------------------------------------------------
  const growthComparisonEl = document.querySelector('#growthComparison');
  if (growthComparisonEl) {
    const growthComparisonConfig = {
      chart: {
        height: 300,
        type: 'line',
        parentHeightOffset: 0,
        toolbar: {
          show: false
        }
      },
      series: [
        {
          name: 'YouTube',
          data: [15, 18, 14, 19, 22, 26]
        },
        {
          name: 'Instagram',
          data: [12, 15, 18, 20, 22, 28]
        },
        {
          name: 'TikTok',
          data: [8, 10, 15, 20, 30, 42]
        }
      ],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: [config.colors.danger, config.colors.primary, config.colors.dark],
      markers: {
        size: 4,
        strokeColors: cardColor,
        strokeWidth: 2,
        strokeOpacity: 1,
        fillOpacity: 1,
        hover: {
          size: 6
        }
      },
      grid: {
        borderColor: borderColor,
        padding: {
          top: -10,
          bottom: -10,
          left: 0,
          right: 0
        }
      },
      xaxis: {
        categories: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
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
          formatter: function (val) {
            return val + '%';
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
      tooltip: {
        y: {
          formatter: function (val) {
            return val + '%';
          }
        }
      }
    };

    const growthComparisonChart = new ApexCharts(growthComparisonEl, growthComparisonConfig);
    growthComparisonChart.render();
  }

  // Event Listeners para as Funcionalidades de Relatórios
  // --------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    // Inicialização do formulário de relatórios
    const filterReportsForm = document.getElementById('filterReports');
    const reportPeriodSelect = document.getElementById('reportPeriod');
    const customDateFields = document.querySelectorAll('.custom-date');

    if (filterReportsForm && reportPeriodSelect) {
      // Mostrar/esconder campos de data personalizada
      reportPeriodSelect.addEventListener('change', function () {
        if (this.value === 'custom') {
          customDateFields.forEach(field => field.classList.remove('d-none'));
        } else {
          customDateFields.forEach(field => field.classList.add('d-none'));
        }
      });

      // Envio do formulário
      filterReportsForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Gerando relatório...');
        // Aqui seria implementada a lógica para gerar o relatório
        alert('Relatório gerado com sucesso! (Simulação)');
      });
    }

    // Inicialização de tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  });
})();
/**
 * Relatórios Financeiros
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

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

  // Manipular exibição de campos de data personalizados
  const toggleCustomDateFields = () => {
    const reportPeriod = document.getElementById('reportPeriod');
    const customDateFields = document.querySelectorAll('.custom-date');
    
    if (reportPeriod) {
      reportPeriod.addEventListener('change', function() {
        if (this.value === 'custom') {
          customDateFields.forEach(field => field.classList.remove('d-none'));
        } else {
          customDateFields.forEach(field => field.classList.add('d-none'));
        }
      });
    }
  };

  // Carregar dados do relatório
  const loadReportData = async (reportType, period, startDate, endDate) => {
    try {
      // Construir parâmetros da query
      let queryParams = new URLSearchParams({
        type: reportType,
        period: period
      });
      
      // Adicionar datas personalizadas se necessário
      if (period === 'custom') {
        queryParams.append('start_date', startDate);
        queryParams.append('end_date', endDate);
      }
      
      // Fazer requisição para a API
      const response = await fetch(`/api/reports?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados do relatório');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
      // Retornar dados de demonstração em caso de erro
      return getDemoReportData(reportType);
    }
  };

  // Gerar dados de demonstração para relatórios
  const getDemoReportData = (reportType) => {
    switch (reportType) {
      case 'income-expense':
        return {
          summary: {
            income: 38759.20,
            expense: 18229.10,
            balance: 20530.10,
            growth: {
              income: 12.5,
              expense: -4.2,
              balance: 18.7
            }
          },
          monthly: [
            { month: 'Jan', income: 5800, expense: 3200 },
            { month: 'Fev', income: 6300, expense: 3400 },
            { month: 'Mar', income: 6800, expense: 2800 },
            { month: 'Abr', income: 6200, expense: 3100 },
            { month: 'Mai', income: 7500, expense: 2900 },
            { month: 'Jun', income: 8200, expense: 2800 }
          ]
        };
      
      case 'by-category':
        return {
          categories: [
            { name: 'AdSense', type: 'income', total: 12890.45, percentage: 33.3, growth: 8.2 },
            { name: 'Patrocínio', type: 'income', total: 15000.00, percentage: 38.7, growth: 15.0 },
            { name: 'Programa de Afiliados', type: 'income', total: 8500.00, percentage: 21.9, growth: 22.5 },
            { name: 'Venda Direta', type: 'income', total: 2368.75, percentage: 6.1, growth: -12.8 },
            { name: 'Equipamento', type: 'expense', total: 9500.00, percentage: 52.1, growth: 28.5 },
            { name: 'Software', type: 'expense', total: 3450.00, percentage: 18.9, growth: -5.2 },
            { name: 'Serviços', type: 'expense', total: 3789.10, percentage: 20.8, growth: 2.1 },
            { name: 'Impostos', type: 'expense', total: 1490.00, percentage: 8.2, growth: -12.4 }
          ]
        };
      
      case 'by-channel':
        return {
          channels: [
            { name: 'YouTube', total: 15780.25, percentage: 40.7, growth: 18.2 },
            { name: 'Instagram', total: 12560.95, percentage: 32.4, growth: 25.8 },
            { name: 'TikTok', total: 10418.00, percentage: 26.9, growth: 42.3 }
          ],
          monthlyByChannel: [
            { month: 'Jan', youtube: 2100, instagram: 1900, tiktok: 1800 },
            { month: 'Fev', youtube: 2300, instagram: 2000, tiktok: 2000 },
            { month: 'Mar', youtube: 2500, instagram: 2200, tiktok: 2100 },
            { month: 'Abr', youtube: 2600, instagram: 2300, tiktok: 1300 },
            { month: 'Mai', youtube: 3100, instagram: 2500, tiktok: 1900 },
            { month: 'Jun', youtube: 3180, instagram: 2560, tiktok: 2460 }
          ]
        };
      
      default:
        return {
          summary: {
            income: 38759.20,
            expense: 18229.10,
            balance: 20530.10
          }
        };
    }
  };

  // Exibir relatório de Receitas x Despesas
  const renderIncomeExpenseReport = (data) => {
    // Atualizar cards de resumo
    if (data.summary) {
      document.getElementById('totalIncome').textContent = `R$ ${data.summary.income.toFixed(2).replace('.', ',')}`;
      document.getElementById('totalExpenses').textContent = `R$ ${data.summary.expense.toFixed(2).replace('.', ',')}`;
      document.getElementById('totalProfit').textContent = `R$ ${data.summary.balance.toFixed(2).replace('.', ',')}`;
      
      // Atualizar percentuais de crescimento
      if (data.summary.growth) {
        document.getElementById('incomeGrowthPercent').textContent = `${data.summary.growth.income > 0 ? '+' : ''}${data.summary.growth.income.toFixed(1)}% em relação ao período anterior`;
        document.getElementById('expenseGrowthPercent').textContent = `${data.summary.growth.expense > 0 ? '+' : ''}${data.summary.growth.expense.toFixed(1)}% em relação ao período anterior`;
        document.getElementById('profitGrowthPercent').textContent = `${data.summary.growth.balance > 0 ? '+' : ''}${data.summary.growth.balance.toFixed(1)}% em relação ao período anterior`;
      }
    }
    
    // Renderizar gráfico
    renderFinancialReportChart(data.monthly);
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
        colors: [config.colors.success, config.colors.danger],
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
            formatter: function (value) {
              return 'R$ ' + value.toFixed(0);
            }
          }
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return 'R$ ' + value.toFixed(2).replace('.', ',');
            }
          }
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'left',
          labels: {
            colors: legendColor
          }
        }
      };
      
      const financialReportChart = new ApexCharts(financialReportChartEl, financialReportChartConfig);
      financialReportChart.render();
    }
  };

  // Exibir relatório por categoria
  const renderCategoryReport = (data) => {
    // Separar categorias de receita e despesa
    const incomeCategories = data.categories.filter(cat => cat.type === 'income');
    const expenseCategories = data.categories.filter(cat => cat.type === 'expense');
    
    // Renderizar gráficos de categoria
    renderCategoryCharts(incomeCategories, expenseCategories);
    
    // Atualizar tabela de categorias
    renderCategoryTable(data.categories);
  };

  // Gráficos de categorias (pizza)
  const renderCategoryCharts = (incomeCategories, expenseCategories) => {
    // Gráfico de receitas por categoria
    const incomeByCategoryEl = document.querySelector('#incomeByCategory');
    if (incomeByCategoryEl) {
      const incomeCategoryNames = incomeCategories.map(cat => cat.name);
      const incomeCategoryValues = incomeCategories.map(cat => cat.total);
      
      const incomeByCategoryConfig = {
        chart: {
          height: 300,
          type: 'pie',
        },
        labels: incomeCategoryNames,
        series: incomeCategoryValues,
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
        },
        dataLabels: {
          enabled: true,
          formatter: function(value, { seriesIndex, w }) {
            return w.config.labels[seriesIndex] + ': ' + value.toFixed(1) + '%';
          }
        },
        tooltip: {
          y: {
            formatter: function(value) {
              return 'R$ ' + value.toFixed(2).replace('.', ',');
            }
          }
        }
      };
      
      const incomeByCategoryChart = new ApexCharts(incomeByCategoryEl, incomeByCategoryConfig);
      incomeByCategoryChart.render();
    }
    
    // Gráfico de despesas por categoria
    const expensesByCategoryEl = document.querySelector('#expensesByCategory');
    if (expensesByCategoryEl) {
      const expenseCategoryNames = expenseCategories.map(cat => cat.name);
      const expenseCategoryValues = expenseCategories.map(cat => cat.total);
      
      const expensesByCategoryConfig = {
        chart: {
          height: 300,
          type: 'pie',
        },
        labels: expenseCategoryNames,
        series: expenseCategoryValues,
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
        },
        dataLabels: {
          enabled: true,
          formatter: function(value, { seriesIndex, w }) {
            return w.config.labels[seriesIndex] + ': ' + value.toFixed(1) + '%';
          }
        },
        tooltip: {
          y: {
            formatter: function(value) {
              return 'R$ ' + value.toFixed(2).replace('.', ',');
            }
          }
        }
      };
      
      const expensesByCategoryChart = new ApexCharts(expensesByCategoryEl, expensesByCategoryConfig);
      expensesByCategoryChart.render();
    }
  };

  // Tabela de categorias
  const renderCategoryTable = (categories) => {
    const tableBody = document.querySelector('.table-bordered tbody');
    if (!tableBody) return;
    
    // Limpar tabela
    tableBody.innerHTML = '';
    
    // Preencher com dados de categorias
    categories.forEach(category => {
      const row = document.createElement('tr');
      
      // Formatar valores
      const type = category.type === 'income' ? 'Receita' : 'Despesa';
      const typeBadge = `<span class="badge bg-label-${category.type === 'income' ? 'success' : 'danger'}">${type}</span>`;
      const growth = `<span class="text-${category.growth >= 0 ? 'success' : 'danger'}">${category.growth > 0 ? '+' : ''}${category.growth.toFixed(1)}%</span>`;
      
      // Construir linha
      row.innerHTML = `
        <td>${category.name}</td>
        <td>${typeBadge}</td>
        <td>R$ ${category.total.toFixed(2).replace('.', ',')}</td>
        <td>${category.percentage.toFixed(1)}%</td>
        <td>${growth}</td>
      `;
      
      tableBody.appendChild(row);
    });
  };

  // Exibir relatório por canal
  const renderChannelReport = (data) => {
    // Renderizar gráficos de canal
    renderChannelCharts(data);
    
    // Atualizar cards de canal
    renderChannelCards(data.channels);
  };

  // Gráficos de canal
  const renderChannelCharts = (data) => {
    // Gráfico de receitas por canal (pizza)
    const revenueByChannelEl = document.querySelector('#revenueByChannel');
    if (revenueByChannelEl && data.channels) {
      const channelNames = data.channels.map(channel => channel.name);
      const channelValues = data.channels.map(channel => channel.total);
      
      const revenueByChannelConfig = {
        chart: {
          height: 300,
          type: 'pie',
        },
        labels: channelNames,
        series: channelValues,
        colors: [
          config.colors.danger,  // YouTube
          config.colors.primary, // Instagram
          config.colors.dark     // TikTok
        ],
        stroke: {
          width: 0
        },
        legend: {
          position: 'bottom',
          labels: {
            colors: legendColor
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(value, { seriesIndex, w }) {
            return w.config.labels[seriesIndex] + ': ' + value.toFixed(1) + '%';
          }
        },
        tooltip: {
          y: {
            formatter: function(value) {
              return 'R$ ' + value.toFixed(2).replace('.', ',');
            }
          }
        }
      };
      
      const revenueByChannelChart = new ApexCharts(revenueByChannelEl, revenueByChannelConfig);
      revenueByChannelChart.render();
    }
    
    // Gráfico de comparação de crescimento (linha)
    const growthComparisonEl = document.querySelector('#growthComparison');
    if (growthComparisonEl && data.monthlyByChannel) {
      const months = data.monthlyByChannel.map(item => item.month);
      
      const growthComparisonConfig = {
        chart: {
          height: 300,
          type: 'line',
          dropShadow: {
            enabled: true,
            color: borderColor,
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: false
          }
        },
        series: [
          {
            name: 'YouTube',
            data: data.monthlyByChannel.map(item => item.youtube)
          },
          {
            name: 'Instagram',
            data: data.monthlyByChannel.map(item => item.instagram)
          },
          {
            name: 'TikTok',
            data: data.monthlyByChannel.map(item => item.tiktok)
          }
        ],
        colors: [config.colors.danger, config.colors.primary, config.colors.dark],
        stroke: {
          width: 3,
          curve: 'smooth'
        },
        grid: {
          borderColor: borderColor,
          row: {
            colors: ['transparent', 'transparent'],
            opacity: 0.5
          }
        },
        markers: {
          size: 6
        },
        xaxis: {
          categories: months,
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
            formatter: function(value) {
              return 'R$ ' + value.toFixed(0);
            }
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5,
          labels: {
            colors: legendColor
          }
        }
      };
      
      const growthComparisonChart = new ApexCharts(growthComparisonEl, growthComparisonConfig);
      growthComparisonChart.render();
    }
  };

  // Cards de canal
  const renderChannelCards = (channels) => {
    if (!channels) return;
    
    // Mapear ícones de canais
    const channelIcons = {
      'YouTube': 'bxl-youtube text-danger',
      'Instagram': 'bxl-instagram text-primary',
      'TikTok': 'bxl-tiktok text-dark'
    };
    
    // Mapear cores de progresso
    const progressColors = {
      'YouTube': 'bg-danger',
      'Instagram': 'bg-primary',
      'TikTok': 'bg-dark'
    };
    
    // Atualizar cada card de canal
    channels.forEach(channel => {
      const cardElement = document.querySelector(`#${channel.name.toLowerCase()}Card`);
      if (!cardElement) return;
      
      // Atualizar valores no card
      cardElement.querySelector('.card-title').innerHTML = `<i class="bx ${channelIcons[channel.name]} me-2 fs-3"></i> ${channel.name}`;
      cardElement.querySelector('.revenue-amount').textContent = `R$ ${channel.total.toFixed(2).replace('.', ',')}`;
      cardElement.querySelector('.percentage-text').textContent = `${channel.percentage.toFixed(1)}% do total`;
      cardElement.querySelector('.growth-text').textContent = `${channel.growth > 0 ? '+' : ''}${channel.growth.toFixed(1)}%`;
      cardElement.querySelector('.growth-text').className = `growth-text text-${channel.growth >= 0 ? 'success' : 'danger'}`;
      
      // Atualizar barra de progresso
      const progressBar = cardElement.querySelector('.progress-bar');
      progressBar.style.width = `${channel.percentage}%`;
      progressBar.className = `progress-bar ${progressColors[channel.name]}`;
      progressBar.setAttribute('aria-valuenow', channel.percentage);
    });
  };

  // Configurar o formulário de relatório
  const setupReportForm = () => {
    const form = document.getElementById('filterReports');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Obter valores do formulário
      const reportType = document.getElementById('reportType').value;
      const reportPeriod = document.getElementById('reportPeriod').value;
      const reportFormat = document.getElementById('reportFormat').value;
      
      let startDate = '';
      let endDate = '';
      
      // Se período personalizado, obter datas
      if (reportPeriod === 'custom') {
        startDate = document.getElementById('reportDateFrom').value;
        endDate = document.getElementById('reportDateTo').value;
        
        if (!startDate || !endDate) {
          alert('Por favor, informe as datas inicial e final para o período personalizado.');
          return;
        }
      }
      
      // Se o formato for para download (PDF, Excel, CSV)
      if (['pdf', 'excel', 'csv'].includes(reportFormat)) {
        // Redirecionamento para API de exportação
        let queryParams = new URLSearchParams({
          type: reportType,
          period: reportPeriod,
          format: reportFormat
        });
        
        if (reportPeriod === 'custom') {
          queryParams.append('start_date', startDate);
          queryParams.append('end_date', endDate);
        }
        
        window.location.href = `/api/reports/export?${queryParams.toString()}`;
        return;
      }
      
      // Exibir spinner de carregamento
      document.querySelector('#reportsContainer').innerHTML = `
        <div class="d-flex justify-content-center my-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
        </div>
      `;
      
      // Carregar dados do relatório
      const reportData = await loadReportData(reportType, reportPeriod, startDate, endDate);
      
      // Renderizar relatório baseado no tipo
      renderReport(reportType, reportData);
    });
  };

  // Renderizar relatório baseado no tipo
  const renderReport = (reportType, data) => {
    // Limpar container de relatórios
    const reportsContainer = document.querySelector('#reportsContainer');
    if (!reportsContainer) return;
    
    // Remover relatórios existentes
    reportsContainer.innerHTML = '';
    
    // Renderizar relatório baseado no tipo
    switch (reportType) {
      case 'income-expense':
        reportsContainer.innerHTML = createIncomeExpenseReportHTML();
        renderIncomeExpenseReport(data);
        break;
      
      case 'by-category':
        reportsContainer.innerHTML = createCategoryReportHTML();
        renderCategoryReport(data);
        break;
      
      case 'by-channel':
        reportsContainer.innerHTML = createChannelReportHTML();
        renderChannelReport(data);
        break;
      
      default:
        reportsContainer.innerHTML = `
          <div class="alert alert-warning" role="alert">
            Tipo de relatório não implementado: ${reportType}
          </div>
        `;
    }
  };

  // Templates HTML para cada tipo de relatório
  const createIncomeExpenseReportHTML = () => {
    return `
      <div class="row">
        <div class="col-12 mb-4">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Relatório: Receitas x Despesas</h5>
              <div class="dropdown">
                <button
                  class="btn btn-sm btn-outline-primary dropdown-toggle"
                  type="button"
                  id="growthReportId"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  2023
                </button>
                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="growthReportId">
                  <a class="dropdown-item" href="javascript:void(0);">2022</a>
                  <a class="dropdown-item" href="javascript:void(0);">2021</a>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div id="financialReportChart" style="height: 400px;"></div>
              <div class="row mt-4">
                <div class="col-md-4">
                  <div class="card bg-success text-white">
                    <div class="card-body">
                      <h5 class="card-title text-white">Total de Receitas</h5>
                      <h3 class="mb-2" id="totalIncome">R$ 0,00</h3>
                      <p class="mb-0" id="incomeGrowthPercent">0% em relação ao período anterior</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card bg-danger text-white">
                    <div class="card-body">
                      <h5 class="card-title text-white">Total de Despesas</h5>
                      <h3 class="mb-2" id="totalExpenses">R$ 0,00</h3>
                      <p class="mb-0" id="expenseGrowthPercent">0% em relação ao período anterior</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card bg-primary text-white">
                    <div class="card-body">
                      <h5 class="card-title text-white">Lucro Líquido</h5>
                      <h3 class="mb-2" id="totalProfit">R$ 0,00</h3>
                      <p class="mb-0" id="profitGrowthPercent">0% em relação ao período anterior</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const createCategoryReportHTML = () => {
    return `
      <div class="row">
        <div class="col-12 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Relatório: Análise por Categoria</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>Receitas por Categoria</h6>
                  <div id="incomeByCategory" style="height: 300px;"></div>
                </div>
                <div class="col-md-6">
                  <h6>Despesas por Categoria</h6>
                  <div id="expensesByCategory" style="height: 300px;"></div>
                </div>
              </div>
              <div class="table-responsive mt-4">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Categoria</th>
                      <th>Tipo</th>
                      <th>Total</th>
                      <th>% do Total</th>
                      <th>Comparação com período anterior</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Dados serão inseridos dinamicamente -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const createChannelReportHTML = () => {
    return `
      <div class="row">
        <div class="col-12 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Relatório: Análise por Canal</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>Receitas por Canal</h6>
                  <div id="revenueByChannel" style="height: 300px;"></div>
                </div>
                <div class="col-md-6">
                  <h6>Comparação de Crescimento</h6>
                  <div id="growthComparison" style="height: 300px;"></div>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-md-4">
                  <div class="card" id="youtubeCard">
                    <div class="card-body">
                      <div class="d-flex align-items-center mb-3">
                        <h5 class="card-title mb-0">YouTube</h5>
                      </div>
                      <h3 class="mb-1 revenue-amount">R$ 0,00</h3>
                      <div class="d-flex justify-content-between">
                        <small class="percentage-text">0% do total</small>
                        <small class="growth-text text-success">+0%</small>
                      </div>
                      <div class="progress mt-2" style="height: 8px;">
                        <div class="progress-bar bg-danger" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card" id="instagramCard">
                    <div class="card-body">
                      <div class="d-flex align-items-center mb-3">
                        <h5 class="card-title mb-0">Instagram</h5>
                      </div>
                      <h3 class="mb-1 revenue-amount">R$ 0,00</h3>
                      <div class="d-flex justify-content-between">
                        <small class="percentage-text">0% do total</small>
                        <small class="growth-text text-success">+0%</small>
                      </div>
                      <div class="progress mt-2" style="height: 8px;">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="card" id="tiktokCard">
                    <div class="card-body">
                      <div class="d-flex align-items-center mb-3">
                        <h5 class="card-title mb-0">TikTok</h5>
                      </div>
                      <h3 class="mb-1 revenue-amount">R$ 0,00</h3>
                      <div class="d-flex justify-content-between">
                        <small class="percentage-text">0% do total</small>
                        <small class="growth-text text-success">+0%</small>
                      </div>
                      <div class="progress mt-2" style="height: 8px;">
                        <div class="progress-bar bg-dark" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  // Configurar eventos para salvar relatórios
  const setupSaveReportButton = () => {
    const saveButton = document.querySelector('.save-report-button');
    if (!saveButton) return;
    
    saveButton.addEventListener('click', function() {
      // Criar modal para salvar relatório
      const modalHTML = `
        <div class="modal fade" id="saveReportModal" tabindex="-1" aria-labelledby="saveReportModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="saveReportModalLabel">Salvar Relatório</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="saveReportForm">
                  <div class="mb-3">
                    <label for="reportName" class="form-label">Nome do Relatório</label>
                    <input type="text" class="form-control" id="reportName" required>
                  </div>
                  <div class="mb-3">
                    <label for="reportDescription" class="form-label">Descrição (opcional)</label>
                    <textarea class="form-control" id="reportDescription" rows="3"></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="confirmSaveReport">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Adicionar modal ao documento se ainda não existir
      if (!document.getElementById('saveReportModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
      }
      
      // Mostrar modal
      const saveReportModal = new bootstrap.Modal(document.getElementById('saveReportModal'));
      saveReportModal.show();
      
      // Configurar botão de confirmação
      document.getElementById('confirmSaveReport').addEventListener('click', async function() {
        const reportName = document.getElementById('reportName').value;
        const reportDescription = document.getElementById('reportDescription').value;
        
        if (!reportName) {
          alert('Por favor, informe um nome para o relatório.');
          return;
        }
        
        // Obter configurações atuais do relatório
        const reportType = document.getElementById('reportType').value;
        const reportPeriod = document.getElementById('reportPeriod').value;
        
        let startDate = '';
        let endDate = '';
        
        if (reportPeriod === 'custom') {
          startDate = document.getElementById('reportDateFrom').value;
          endDate = document.getElementById('reportDateTo').value;
        }
        
        try {
          // Enviar para API
          const response = await fetch('/api/reports/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: reportName,
              description: reportDescription,
              type: reportType,
              period: reportPeriod,
              start_date: startDate,
              end_date: endDate
            })
          });
          
          if (!response.ok) {
            throw new Error('Erro ao salvar relatório');
          }
          
          // Fechar modal
          saveReportModal.hide();
          
          // Exibir mensagem de sucesso
          alert('Relatório salvo com sucesso!');
          
          // Atualizar lista de relatórios salvos
          loadSavedReports();
        } catch (error) {
          console.error('Erro ao salvar relatório:', error);
          alert('Erro ao salvar relatório. Tente novamente.');
        }
      });
    });
  };

  // Carregar relatórios salvos
  const loadSavedReports = async () => {
    try {
      const response = await fetch('/api/reports/saved');
      if (!response.ok) {
        throw new Error('Erro ao carregar relatórios salvos');
      }
      
      const data = await response.json();
      updateSavedReportsTable(data.reports);
    } catch (error) {
      console.error('Erro ao carregar relatórios salvos:', error);
      // Manter os dados de demonstração existentes na tabela
    }
  };

  // Atualizar tabela de relatórios salvos
  const updateSavedReportsTable = (reports) => {
    const tableBody = document.querySelector('#savedReportsTable tbody');
    if (!tableBody) return;
    
    // Se temos dados reais
    if (reports && reports.length > 0) {
      tableBody.innerHTML = '';
      
      reports.forEach(report => {
        const row = document.createElement('tr');
        
        // Formatar datas
        const createdAt = new Date(report.created_at).toLocaleDateString('pt-BR');
        const updatedAt = new Date(report.updated_at).toLocaleDateString('pt-BR');
        
        // Determinar o período do relatório
        let period = '';
        if (report.period === 'custom' && report.start_date && report.end_date) {
          const startDate = new Date(report.start_date).toLocaleDateString('pt-BR');
          const endDate = new Date(report.end_date).toLocaleDateString('pt-BR');
          period = `${startDate} - ${endDate}`;
        } else {
          const periodMap = {
            'this-month': 'Mês Atual',
            'last-month': 'Mês Anterior',
            'last-3-months': 'Últimos 3 Meses',
            'last-6-months': 'Últimos 6 Meses',
            'this-year': 'Ano Atual',
            'last-year': 'Ano Anterior'
          };
          period = periodMap[report.period] || report.period;
        }
        
        // Construir a linha
        row.innerHTML = `
          <td>${report.name}</td>
          <td>${getReportTypeName(report.type)}</td>
          <td>${period}</td>
          <td>${createdAt}</td>
          <td>${updatedAt}</td>
          <td>
            <div class="dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <i class="bx bx-dots-vertical-rounded"></i>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="javascript:viewReport('${report.id}');">
                  <i class="bx bx-show-alt me-1"></i> Visualizar
                </a>
                <a class="dropdown-item" href="javascript:updateReport('${report.id}');">
                  <i class="bx bx-refresh me-1"></i> Atualizar
                </a>
                <a class="dropdown-item" href="javascript:downloadReport('${report.id}');">
                  <i class="bx bx-download me-1"></i> Baixar
                </a>
                <a class="dropdown-item" href="javascript:deleteReport('${report.id}');">
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

  // Obter nome legível do tipo de relatório
  const getReportTypeName = (type) => {
    const typeMap = {
      'income-expense': 'Receitas x Despesas',
      'by-category': 'Análise por Categoria',
      'by-channel': 'Análise por Canal',
      'monthly-comparison': 'Comparação Mensal',
      'quarterly-comparison': 'Comparação Trimestral',
      'annual-comparison': 'Comparação Anual'
    };
    return typeMap[type] || type;
  };

  // Funções para gerenciar relatórios salvos
  window.viewReport = function(id) {
    window.location.href = `financial-reports.html?report=${id}`;
  };

  window.updateReport = async function(id) {
    try {
      const response = await fetch(`/api/reports/saved/${id}/update`);
      if (!response.ok) {
        throw new Error('Erro ao atualizar relatório');
      }
      
      alert('Relatório atualizado com sucesso!');
      loadSavedReports();
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);
      alert('Erro ao atualizar relatório. Tente novamente.');
    }
  };

  window.downloadReport = function(id) {
    window.location.href = `/api/reports/saved/${id}/download`;
  };

  window.deleteReport = async function(id) {
    if (!confirm('Tem certeza que deseja excluir este relatório?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/reports/saved/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Erro ao excluir relatório');
      }
      
      alert('Relatório excluído com sucesso!');
      loadSavedReports();
    } catch (error) {
      console.error('Erro ao excluir relatório:', error);
      alert('Erro ao excluir relatório. Tente novamente.');
    }
  };

  // Verificar parâmetros da URL
  const checkUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('report');
    
    if (reportId) {
      // Carregar e exibir relatório salvo
      loadSavedReport(reportId);
    }
  };

  // Carregar relatório salvo
  const loadSavedReport = async (id) => {
    try {
      const response = await fetch(`/api/reports/saved/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar relatório salvo');
      }
      
      const report = await response.json();
      
      // Preencher o formulário com as configurações do relatório
      document.getElementById('reportType').value = report.type;
      document.getElementById('reportPeriod').value = report.period;
      
      if (report.period === 'custom') {
        document.getElementById('reportDateFrom').value = report.start_date;
        document.getElementById('reportDateTo').value = report.end_date;
        document.querySelectorAll('.custom-date').forEach(field => field.classList.remove('d-none'));
      }
      
      // Simular submit do formulário
      document.getElementById('filterReports').dispatchEvent(new Event('submit'));
    } catch (error) {
      console.error('Erro ao carregar relatório salvo:', error);
      alert('Erro ao carregar relatório salvo. Tente novamente.');
    }
  };

  // Inicializar a página
  const init = () => {
    toggleCustomDateFields();
    setupReportForm();
    setupSaveReportButton();
    loadSavedReports();
    checkUrlParams();
  };
  
  // Iniciar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
});
