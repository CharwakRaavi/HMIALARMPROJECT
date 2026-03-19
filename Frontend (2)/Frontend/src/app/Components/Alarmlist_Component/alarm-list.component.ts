import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventRecord } from '../alarm.models';

@Component({
  selector: 'app-alarm-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alarm-list.component.html',
  styleUrls: ['./alarm-list.component.css']
})
export class AlarmListComponent {
  @Input() events: EventRecord[] = [];
  @Output() ackEvent = new EventEmitter<EventRecord>();
  @Output() clearEvent = new EventEmitter<EventRecord>();

  trackByEventId(index: number, event: EventRecord): number {
    return event.id;
  }

  severityClass(sev: string): Record<string, boolean> {
    const s = sev?.toUpperCase() || '';
    return {
      'bg-danger text-white': s === 'HIGH' || s === 'CRITICAL',
      'bg-warning text-dark': s === 'MEDIUM',
      'bg-info text-dark': s === 'LOW'
    };
  }

  onAck(e: EventRecord) { this.ackEvent.emit(e); }
  onClear(e: EventRecord) { this.clearEvent.emit(e); }
}