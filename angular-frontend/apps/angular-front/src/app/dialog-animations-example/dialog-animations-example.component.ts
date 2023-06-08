import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-animations-example',
  templateUrl: './dialog-animations-example.component.html',
  styleUrls: ['./dialog-animations-example.component.scss'],
})
export class DialogAnimationsExampleComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogAnimationsExampleComponent>
  ) {}
}
