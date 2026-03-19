import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ack-button',
  standalone: true,
  templateUrl: './ack-button.component.html',
  styleUrls: ['./ack-button.component.css']
})
export class AckButtonComponent {
  @Output() ackAll = new EventEmitter<void>();

  onClick() {
    this.ackAll.emit();
  }
}