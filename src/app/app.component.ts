import { Component, ViewChild, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService]
})
export class AppComponent implements OnInit{
  title = 'tic-tac-toe-angular';
  roomNumber = <Number> 0;
  playedText = <string>'';
  gameGrid = <Array<Object>>[];
  playedGameGrid = <Array<Object>>[];
  displayPlayerTurn = <Boolean> true;

  constructor(
    private appService: AppService,
  ){
    this.gameGrid = appService.gameGrid;
  }

  ngOnInit(){
    
  }

  renderPlayedText(number) {
		if (this.playedGameGrid[number] === undefined) {
			return '';
		}else {
			this.playedText = this.playedGameGrid[number]['player'];
			return "this.playedText;"
		}
	}
}
