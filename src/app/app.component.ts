import { Component, Renderer, ViewChild , OnInit } from '@angular/core';
import { AppService } from './app.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [AppService]
})
export class AppComponent implements OnInit {

	private title = "Tic-Tac-Toe-Multiplayer-Game";
	private gameGrid = <Array<Object>>[];
	private playedGameGrid = <Array<Object>>[];
	private movesPlayed = <number>0;
	private displayPlayerTurn = <Boolean>true;
	private myTurn = <Boolean>true;
	private whoWillStart = <Boolean>true;
	@ViewChild('content') private content;
	private modalOption: NgbModalOptions = {};
	private totalRooms = <Number> 0;
	private emptyRooms = <Array<number>> [];
	private roomNumber = <Number> 0;
	private playedText = <string>'';
	private whoseTurn = 'X';
	private numbersOfPlayer1Won = <number>0;
	private numbersOfPlayer2Won = <number>0;
	private numbersOfTieGame= <number>0;
	private totalGamesPlayed= <number>0;

	constructor(
		private _renderer: Renderer,
		private modalService: NgbModal,
		private appService: AppService,
	) {
		this.gameGrid = appService.gameGrid;
	}

	ngOnInit() {
		//Code to display the Modal
		this.modalOption.backdrop = 'static';
		this.modalOption.keyboard = false;
		this.modalOption.size = 'lg';
		const localModalRef = this.modalService.open(this.content, this.modalOption);


		// connect the player to the socket
		this.appService.connectSocket();

		this.appService.getRoomStats().then(response => {
			this.totalRooms = response['totalRoomCount'];
			this.emptyRooms = response['emptyRooms'];
		});

		this.appService.getRoomsAvailable().subscribe(response => {
			this.totalRooms = response['totalRoomCount'];
			this.emptyRooms = response['emptyRooms'];
		});

		this.appService.startGame().subscribe((response) => {
			localModalRef.close();
			this.roomNumber = response['roomNumber'];
		});

		this.appService.receivePlayerMove().subscribe((response) => {
			this.opponentMove(response);
		});

		this.appService.playerLeft().subscribe((response) => {
			alert('Player Left');
			window.location.reload();
		});
	}


	//Method to join the new Room by passing Romm Number
	joinRoom(roomNumber) {
		this.myTurn = false;
		this.whoWillStart = false;
		this.whoseTurn = 'O';
		this.appService.joinNewRoom(roomNumber);
	}

	//Method create new room
	createRoom() {
		this.myTurn = true;
		this.whoseTurn = 'X';
		this.whoWillStart = true;
		this.appService.createNewRoom().subscribe( (response) => {
			this.roomNumber = response.roomNumber;
		});
	}

	opponentMove(params) {
		this.displayPlayerTurn = !this.displayPlayerTurn ? true : false;
		if (params['winner'] ===  null) {
			this.playedGameGrid[params['position']] = {
				position: params['position'],
				player: params['playedText']
			};
			this.myTurn = true;
		}else {
			if(params['winner'].charAt(0) == 'X'){
				this.numbersOfPlayer1Won++;
			}
			else if(params['winner'].charAt(0) == 'O'){
				this.numbersOfPlayer2Won++;
			}
			else if(params['winner'].charAt(0) == 'T'){
				this.numbersOfTieGame++;
			}
			this.totalGamesPlayed = this.numbersOfPlayer1Won + this.numbersOfPlayer2Won + this.numbersOfTieGame;
			alert(params['winner']);
			this.resetGame();
		}
	}


	//This method will be called when the current user tries to play his/her move
	play(number) {
		if (!this.myTurn) {
			return;
		}
		this.movesPlayed += 1;
		this.playedGameGrid[number] = {
			position: number,
			player: this.whoseTurn
		};
		this.appService.sendPlayerMove({
			'roomNumber' : this.roomNumber,
			'playedText': this.whoseTurn,
			'position' : number,
			'playedGameGrid': this.playedGameGrid,
			'movesPlayed' : this.movesPlayed
		});
		this.myTurn = false;
		this.displayPlayerTurn = !this.displayPlayerTurn ? true : false;
	}

	renderPlayedText(number) {
		if (this.playedGameGrid[number] === undefined) {
			return '';
		}else {
			this.playedText = this.playedGameGrid[number]['player'];
			return this.playedText;
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