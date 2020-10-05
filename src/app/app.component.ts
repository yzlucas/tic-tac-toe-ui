import { Component, ViewChild, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService]
})
export class AppComponent {
  title = 'tic-tac-toe-angular';
  roomNumber = <Number> 0;
  playedText = <string>'';
  gameGrid = <Array<Object>>[];
  private playedGameGrid = <Array<Object>>[];


}
