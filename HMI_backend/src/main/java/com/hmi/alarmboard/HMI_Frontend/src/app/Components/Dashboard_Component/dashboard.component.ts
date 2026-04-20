  import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Inject, PLATFORM_ID} from '@angular/core';
  import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlarmService } from '../../services/alarm.service'; 
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { EventRecord, Summary, PageResponse } from '../alarm.models'; 
import { Subscription, interval } from 'rxjs';
 

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
  public hasHighActiveAlarm: boolean = false;
  private lastKnownActiveCount: number = 0;
  events: EventRecord[] = [];
  summary: Summary = { active: 0, acknowledged: 0, cleared: 0, total: 0 };
  severities: string[] = ['All', 'High', 'Medium', 'Low'];
  states: string[] = ['Active', 'Acknowledged', 'Cleared'];
  selectedFilters: Set<string> = new Set();
  private lastHighCount: number = 0;
  private isAudioPlaying = false;
  private pollingSub?: Subscription;
 
  public pieData: ChartData<'doughnut', number[], string> = {
    labels: ['Active', 'Cleared', 'Acknowledged'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#ef4444', '#22c55e', '#a2c5f3'],
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
 
  constructor(private svc: AlarmService, private cdr: ChangeDetectorRef,@Inject(PLATFORM_ID) private platformId: Object) {}
 
  ngOnInit(): void {
    this.selectedFilters.add('All');
    if (isPlatformBrowser(this.platformId)) {
      this.refreshData();
 
    this.pollingSub = interval(2000).subscribe(() => {
      this.refreshData();
    });
  }
  }
 
  private refreshData(): void {
    this.loadEvents();
    this.loadSummary();
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
 
  private triggerAlarmSound(): void {
  
  if (isPlatformBrowser(this.platformId)) {
    const audio = new Audio('assets/sound.mp3');
    audio.load();
    audio.play().catch(err => {
      
      console.warn("Playback blocked. Click the UI to enable alarm sounds.");
    });
  }
}
 
  
private lastHighActiveCount: number = 0;
 
private loadSummary(): void {

  this.svc.getSummary().subscribe({
    next: (data: any) => {
      
      this.summary = {
        active: data.ACTIVE || 0,
        acknowledged: data.ACKNOWLEDGED || 0,
        cleared: data.CLEARED || 0,
        total: (data.ACTIVE || 0) + (data.ACKNOWLEDGED || 0) + (data.CLEARED || 0)
      };
      this.hasHighActiveAlarm = this.summary.active > 0;
 
     
      this.svc.getFilteredEvents(0, 1, 'High', 'Active').subscribe({
        next: (res: PageResponse<EventRecord>) => {
          const currentGlobalHighActive = res.totalElements || 0;
 
          
          if (currentGlobalHighActive > this.lastHighActiveCount) {
            console.log("!!! IMMEDIATE HIGH ALARM DETECTED !!!");
            this.triggerAlarmSound();
          }
 
         
          this.lastHighActiveCount = currentGlobalHighActive;
         
          this.updateChart();
          this.cdr.detectChanges();
        }
      });
    }
  });
}
 
  private updateChart(): void {
    this.pieData.datasets[0].data = [
      this.summary.active,
      this.summary.cleared,
      this.summary.acknowledged
    ];
   
    if (this.chart) {
      this.chart.update();
    }
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
 
  get recentEvents(): EventRecord[] { return this.events.slice(0, 8); }
  get activePercentage(): string { return this.summary.total > 0 ? ((this.summary.active / this.summary.total) * 100).toFixed(0) : '0'; }
  get clearedPercentage(): string { return this.summary.total > 0 ? ((this.summary.cleared / this.summary.total) * 100).toFixed(0) : '0'; }
  get acknowledgedPercentage(): string { return this.summary.total > 0 ? ((this.summary.acknowledged / this.summary.total) * 100).toFixed(0) : '0'; }
  get hasActiveOnCurrentPage(): boolean {
  
  return this.events.some(e => e.state?.toUpperCase() === 'ACTIVE');
}
}