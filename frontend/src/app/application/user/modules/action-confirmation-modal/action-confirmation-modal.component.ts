import { Component, Input } from '@angular/core';
import { ActionConfirmationData } from './action-confirmation-data';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-action-confirmation-modal',
  templateUrl: './action-confirmation-modal.component.html',
  styleUrls: ['./action-confirmation-modal.component.css'],
})
export class ActionConfirmationModalComponent {
  @Input() public actionConfirmationData: ActionConfirmationData = {} as ActionConfirmationData;
  public actionConfirmedSubject: Subject<boolean> = new Subject<boolean>();


  constructor() {
  }

  public openModal(): void {
    this.actionConfirmedSubject = new Subject<boolean>();
    this.toggleModal();
  }

  public closeModal(): void {
    this.toggleModal();
  }

  private toggleModal(): void {
    const modal = document.getElementById('action-confirmation');
    modal?.classList.toggle('hidden');
  }

  public confirmAction(): void {
    this.actionConfirmedSubject.next(true);
    this.closeModal();
  }
}
