import { Component, ViewChild, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService]
})
export class AppComponent implements OnInit{
  title = 'tic-tac-toe-angular';
  gameGrid = <Array<Object>>[];
  playedGameGrid = <Array<Object>>[];
  displayPlayerTurn = <Boolean> true;

  //Bootstrap modal Options 
  @ViewChild('content') private content;
  private modalOption: NgbModalOptions = {};

  //Socket related varaibles
  totalRooms = <Number> 0;
  emptyRooms = <Array<number>> [];
  roomNumber = <Number> 0;
  playedText = <string>'';

  constructor(
    private appService: AppService,
    private roomSelectionService: NgbModal,
  ){
    this.gameGrid = appService.gameGrid;
  }

  ngOnInit(){
    const roomSelectionBox = this.roomSelectionService.open(this.content, this.modalOption)
    
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
