import { Injectable } from "@angular/core";
//import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

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
}
