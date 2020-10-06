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
  myTurn = <Boolean>true;
  whoWillStart = <Boolean>true;
  movesPlayed = <number>0;


  //Bootstrap modal Options 
  @ViewChild('content') private content;
  private modalOption: NgbModalOptions = {};

  //Socket related varaibles
  totalRooms = <Number> 0;
  emptyRooms = <Array<number>> [];
  roomNumber = <Number> 0;
  playedText = <string>'';
  whoseTurn = 'X';

  constructor(
    private appService: AppService,
    private roomSelectionService: NgbModal,
  ){
    this.gameGrid = appService.gameGrid;
  }

  ngOnInit(){
    const roomSelectionBox = this.roomSelectionService.open(this.content, this.modalOption)
    this.appService.connectSocket();
    		// HTTP call to get Empty rooms and total room numbers
		this.appService.getRoomStats().then(response => {
			this.totalRooms = response['totalRoomCount'];
			this.emptyRooms = response['emptyRooms'];
    });

		// Socket evenet will total available rooms to play.
		this.appService.getRoomsAvailable().subscribe(response => {
			this.totalRooms = response['totalRoomCount'];
			this.emptyRooms = response['emptyRooms'];
		});

		// Socket evenet to start a new Game
		this.appService.startGame().subscribe((response) => {
			roomSelectionBox.close();
			this.roomNumber = response['roomNumber'];
		});

		// Socket event will receive the Opponent player's Move
		this.appService.receivePlayerMove().subscribe((response) => {
			this.opponentMove(response);
		});

		// Socket event to check if any player left the room, if yes then reload the page.
		this.appService.playerLeft().subscribe((response) => {
			alert('Player Left');
			window.location.reload();
		});
  }

  createRoom() {
		this.myTurn = true;
		this.whoseTurn = 'X';
		this.whoWillStart = true;
		this.appService.createNewRoom().subscribe( (response) => {
			this.roomNumber = response.roomNumber;
		});
	}

  renderPlayedText(number) {
		if (this.playedGameGrid[number] === undefined) {
			return '';
		}else {
			this.playedText = this.playedGameGrid[number]['player'];
			return "this.playedText;"
		}
  }
  
  opponentMove(params) {
		this.displayPlayerTurn = !this.displayPlayerTurn ? true : false;
		if (params['winner'] ===  null) {
			this.playedGameGrid[params['position']] = {
				position: params['position'],
				player: params['playedText']
			};
			this.myTurn = true;
		}
		else if(params['winner'] === 'Game Draw'){
			alert(params['winner']);
			this.resetGame();
		}
		else {
			alert(params['winner']);
			this.resetGame();
		}
  }
  
  resetGame() {
		this.playedGameGrid = [];
		this.gameGrid = [];
		this.gameGrid = this.appService.gameGrid;
		this.movesPlayed = 0;
		if (this.whoWillStart) {
			this.myTurn = true;
			this.displayPlayerTurn = true;
			this.whoseTurn = 'X';
		}else {
			this.displayPlayerTurn = true;
			this.whoseTurn = 'O';
		}
	}
}
