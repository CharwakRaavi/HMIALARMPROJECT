import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-severity-legend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './severity-legend.component.html',
  styleUrls: ['./severity-legend.component.css']
})
export class SeverityLegendComponent {
  @Input() severities: string[] = [];
  @Input() states: string[] = [];
  @Input() selectedFilters: Set<string> = new Set();
  @Output() filterToggled = new EventEmitter<string>();

  onToggle(filter: string): void {
    this.filterToggled.emit(filter);
  }
}