import { Title } from '@angular/platform-browser';
import { UserHttpService } from './../../core/services/userHttp.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-detalhes',
  templateUrl: './user-detalhes.component.html',
  styleUrl: './user-detalhes.component.scss'
})
export class UserDetalhesComponent implements OnInit{
  public detalhes: string = "";
  constructor (private service: UserHttpService, private title: Title) {
  }

  async ngOnInit(): Promise<void> {
    this.title.setTitle('User');
    this.detalhes = JSON.stringify(await this.service.getUserData());
  }

}
