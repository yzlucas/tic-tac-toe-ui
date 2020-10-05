import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch'


@Injectable()
export class AppService {
    public gameGrid = <Array<Object>> [[1,2,3],[4,5,6],[7,8,9]];
    public socket;
    public BASE_URL = 'http://localhost:4000';

    constructor(private http: HttpClient){}

	public getRoomStats() {
		return new Promise(resolve => {
			this.http.get(`http://localhost:4000/getRoomStats`).subscribe(data => {
				resolve(data);
			});
		});
    }
    
    connectSocket(){
        this.socket = io(this.BASE_URL);

    }

    /* Method to receive rooms-available event.*/
	getRoomsAvailable(): any {
		const observable = new Observable(observer => {
			this.socket.on('rooms-available', (data) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}
	/* Method to create new room, create-room event.*/
	createNewRoom(): any {
		this.socket.emit('create-room', { 'test': 9909 });
		const observable = new Observable(observer => {
			this.socket.on('new-room', (data) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}
	/* Method to join new room, create-room event.*/
	joinNewRoom(roomNumber): any {
		this.socket.emit('join-room', { 'roomNumber': roomNumber });
	}
	/* Method to receive start-game event.*/
	startGame(): any {
		const observable = new Observable(observer => {
			this.socket.on('start-game', (data) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}
	/* Method to join new room, create-room event.*/
	sendPlayerMove(params): any {
		this.socket.emit('send-move', params);
	}
	/* Method to receive start-game event.*/
	receivePlayerMove(): any {
		const observable = new Observable(observer => {
			this.socket.on('receive-move', (data) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}
	/* Event to check the if any player is leaving the game */
	playerLeft(): any {
		const observable = new Observable(observer => {
			this.socket.on('room-disconnect', (data) => {
				observer.next(
					data
				);
			});
			return () => {
				this.socket.disconnect();
			};
		});
		return observable;
	}
}

