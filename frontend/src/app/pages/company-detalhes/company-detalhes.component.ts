import { Component } from '@angular/core';
import { UserHttpService } from '../../core/services/userHttp.service';

@Component({
  selector: 'app-company-detalhes',
  templateUrl: './company-detalhes.component.html',
  styleUrl: './company-detalhes.component.scss'
})
export class CompanyDetalhesComponent {
  public detalhes: string = "";
  constructor (private service: UserHttpService) {
  }

  async ngOnInit(): Promise<void> {
    this.detalhes = JSON.stringify(await this.service.getCompanyData());
  }

}
