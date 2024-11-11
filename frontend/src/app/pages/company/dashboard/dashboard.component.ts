import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Chart } from 'chart.js';
import { DashboardService } from '../../../core/services/dashboard.service';
import { CustoMedioCliente, CustoMedioMarcaVeiculo, CustoMedioVeiculo, DashboardData, ItemMaiorCusto, StatusServico } from '../../../core/models/dashboard.model';

import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [CommonModule, ChartModule,
    TableModule,
    PaginatorModule,
    InputTextModule,]
})
export class DashboardComponent implements OnInit {
  dashboardData!: DashboardData;

  // Variáveis para os gráficos
  itensMaiorCustoChart: any;
  statusServicoChart: any;
  itemAFazerTipoChart: any;

  constructor(private dashboardService: DashboardService) { }

  async ngOnInit(): Promise<void> {
    const data = await this.dashboardService.getDashboardData();
    this.dashboardData = data;

    this.itensMaiorCusto = data.itensMaiorCusto;
    this.custoMedioMarcaVeiculo = data.custoMedioMarcaVeiculo;
    this.custoVeiculo = data.custoMedioVeiculo;

    this.initializeCharts();

    console.log({ data });


  }

  initializeCharts(): void {
    // Configuração para cada gráfico
    this.setupStatusServicoChart();
    this.setupItemAFazerTipoChart();
    this.setupTarefasMecanicoChart();
  }

  setupTarefasMecanicoChart(): void {
    const labels = this.dashboardData.tarefasMecanico.map(item => item.nomeMecanico);
    const dataValuesTarefas = this.dashboardData.tarefasMecanico.map(item => item.tarefasConcluidas);
    const dataValuesCusto = this.dashboardData.tarefasMecanico.map(item => item.custoTotal);
    this.itensMaiorCustoChart = new Chart('tarefasMecanicoChart', {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Tarefas Concluidas',
          data: dataValuesTarefas,
          backgroundColor: 'rgba(34, 83, 165, 0.6)',
          borderColor: 'rgba(34, 83, 165, 1)',
          borderWidth: 1,
          tension: 0.4,
          yAxisID: 'y-axis-1',
          
        }, {
          label: 'Custo Total',
          data: dataValuesCusto,
          backgroundColor: 'rgba(255, 165, 0, 0.6)', // laranja mais chamativo
          borderColor: 'rgba(237, 125, 58, 1)',
          borderWidth: 1,
          yAxisID: 'y-axis-2',
          stack: 'true',
          type: 'bar',
        }]
      },
      options: {
        responsive: true,
        scales: {
          'y-axis-1': {
            position: 'left',
            beginAtZero: true,
            bounds: 'ticks',
            axis: 'y',
            grid: {
              drawOnChartArea: false
            },
            suggestedMax: 10,
          },
          'y-axis-2': {
            position: 'right',
            beginAtZero: true,
            grid: {
              drawOnChartArea: false
            },
            suggestedMax: 10,
          }
        }
      },

    });
  }

  setupStatusServicoChart(): void {
    const labels = this.dashboardData.statusServico.map(item => item.status);
    const dataValues = this.dashboardData.statusServico.map(item => item.quantidade);

    this.statusServicoChart = new Chart('statusServicoChart', {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Status dos Serviços',
          data: dataValues,
          backgroundColor: [
            'rgba(255, 165, 0, 0.6)', // laranja mais chamativo
            'rgba(170, 180, 190, 0.6)', // cinza claro
            'rgba(127, 140, 141, 0.6)', // cinza escuro
            'rgba(230, 230, 230, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(255, 230, 0, 0.6)', // laranja mais chamativo
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  setupItemAFazerTipoChart(): void {
    const labels = this.dashboardData.itemAFazerTipo.map(item => item.tipoManutencao);
    const dataValues = this.dashboardData.itemAFazerTipo.map(item => item.quantidade);

    this.itemAFazerTipoChart = new Chart('itemAFazerTipoChart', {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Tipos de Manutenção',
          data: dataValues,
          backgroundColor: [
            'rgba(255, 165, 0, 0.6)', // laranja mais chamativo
            // 'rgba(189, 195, 199, 0.6)', // cinza claro
            'rgba(127, 140, 141, 0.6)', // cinza escuro
            'rgba(255, 200, 200, 0.6)' // branco
          ],
          borderColor: [
            'rgba(255, 230, 0, 0.6)', // laranja mais chamativo
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  // Dados para as tabelas
  itensMaiorCusto: ItemMaiorCusto[] = [];
  custoMedioMarcaVeiculo: CustoMedioMarcaVeiculo[] = [];
  custoVeiculo: CustoMedioVeiculo[] = [];

  // Filtros
  filtroItemCusto: string = '';
  filtroCustoCliente: string = '';
  filtroCustoVeiculo: string = '';




  applyFilter(event: Event, targetArray: any[], filterValue: string) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    (this as any)[filterValue] = value;
    targetArray.filter(item => JSON.stringify(item).toLowerCase().includes(value));
  }

}
