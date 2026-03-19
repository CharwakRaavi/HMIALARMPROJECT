import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlarmService } from '../../services/alarm.service'; // Corrected path
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { EventRecord, Summary, PageResponse } from '../alarm.models'; // Corrected path
import { Subscription, interval } from 'rxjs';

// Updated imports to match your new folder names in the screenshot
import { SeverityLegendComponent } from '../Severitylegend_component/severity-legend.component';
import { AlarmListComponent } from '../Alarmlist_Component/alarm-list.component';
import { AckButtonComponent } from '../Ackbutton_Component/ack-button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    BaseChartDirective, 
    SeverityLegendComponent, 
    AlarmListComponent, 
    AckButtonComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  pageData: PageResponse<EventRecord> | null = null;
  currentPage: number = 0;
  pageSize: number = 8;
  currentSeverityFilter: string = '';
  currentStateFilter: string = '';

  events: EventRecord[] = [];
  summary: Summary = { active: 0, acknowledged: 0, cleared: 0, total: 0 };
  severities: string[] = ['All', 'High', 'Medium', 'Low'];
  states: string[] = ['Active', 'Acknowledged', 'Cleared'];
  selectedFilters: Set<string> = new Set();
  
  private pollingSub?: Subscription; 

  public pieData: ChartData<'doughnut', number[], string> = {
    labels: ['Active', 'Cleared', 'Acknowledged'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#ef4444', '#22c55e', '#e2e8f0'], 
      borderWidth: 0
    }]
  };

  public pieOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { display: false } }
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private svc: AlarmService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.selectedFilters.add('All');
    this.loadEvents();
    this.loadSummary();

    this.pollingSub = interval(10000).subscribe(() => {
      this.loadEvents();
      this.loadSummary();
    });
  }

  ngOnDestroy(): void {
    if (this.pollingSub) this.pollingSub.unsubscribe();
  }

  private loadEvents(): void {
    this.svc.getFilteredEvents(
      this.currentPage,
      this.pageSize,
      this.currentSeverityFilter,
      this.currentStateFilter
    ).subscribe({
      next: (res: PageResponse<EventRecord>) => {
        this.pageData = res;
        this.events = res.content;
        this.cdr.detectChanges();
      }
    });
  }

  private loadSummary(): void {
    this.svc.getSummary().subscribe({
      next: (data: any) => {
        this.summary = {
          active: data.ACTIVE || 0,
          acknowledged: data.ACKNOWLEDGED || 0,
          cleared: data.CLEARED || 0,
          total: (data.ACTIVE || 0) + (data.ACKNOWLEDGED || 0) + (data.CLEARED || 0)
        };
        this.pieData.datasets[0].data = [this.summary.active, this.summary.cleared];
        this.chart?.update();
        this.cdr.detectChanges();
      }
    });
  }

  toggleFilter(filter: string): void {
    if (filter === 'All') {
      this.selectedFilters.clear();
      this.selectedFilters.add('All');
    } else {
      this.selectedFilters.delete('All');
      if (this.severities.includes(filter)) {
        this.severities.forEach(sev => this.selectedFilters.delete(sev));
        this.selectedFilters.add(filter);
      }
      if (this.states.includes(filter)) {
        this.states.forEach(st => this.selectedFilters.delete(st));
        this.selectedFilters.add(filter);
      }
    }

    this.currentSeverityFilter = this.severities.find(s => this.selectedFilters.has(s) && s !== 'All') || '';
    this.currentStateFilter = this.states.find(st => this.selectedFilters.has(st)) || '';
    this.currentPage = 0;
    this.loadEvents();
  }

  get filteredEvents(): EventRecord[] {
    return this.events;
  }

  onPageChange(newPage: number): void {
    if (this.pageData && newPage >= 0 && newPage < this.pageData.totalPages) {
      this.currentPage = newPage;
      this.loadEvents();
    }
  }

  ack(e: EventRecord): void {
    this.svc.acknowledge(e.id).subscribe({
      next: () => { this.loadEvents(); this.loadSummary(); }
    });
  }

  clear(e: EventRecord): void {
    this.svc.clear(e.id).subscribe({
      next: () => { this.loadEvents(); this.loadSummary(); }
    });
  }

  acknowledgeAll(): void {
    const activeEvents = this.events.filter(e => e.state?.toUpperCase() === 'ACTIVE');
    activeEvents.forEach(e => this.svc.acknowledge(e.id).subscribe());
    setTimeout(() => { this.loadSummary(); this.loadEvents(); }, 500);
  }

  getHistoryDotClass(sev: string): string {
    const s = sev?.toUpperCase() || '';
    if (s === 'HIGH') return 'bg-danger';
    if (s === 'MEDIUM') return 'bg-warning';
    return 'bg-success'; 
  }

  get recentEvents(): EventRecord[] { return this.events.slice(0, 10); }
  get activePercentage(): string { return this.summary.total > 0 ? ((this.summary.active / this.summary.total) * 100).toFixed(0) : '0'; }
  get clearedPercentage(): string { return this.summary.total > 0 ? ((this.summary.cleared / this.summary.total) * 100).toFixed(0) : '0'; }
}