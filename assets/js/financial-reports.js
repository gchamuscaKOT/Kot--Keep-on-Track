
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
