import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  obj = {};

  constructor(private auth: AuthService, private http: HttpClient) {
    http.get('http://localhost:8080/getObj/test')
    	.subscribe(data => this.obj = data);
  }

}
