import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IServico } from '../models/servicosModels';
import { ServicoService } from '../services/servico.service';
import { Observable } from 'rxjs';
import { ToasterService } from '../../shared/components/toaster/toaster.service';
import { LoaderService } from '../../shared/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ServicoDetalhesResolver implements Resolve<IServico> {
  constructor(private servicoService: ServicoService, private toaster: ToasterService, private loader: LoaderService) { }

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    
    const id = route.paramMap.get('id');
    if (id) {
      try {
        this.loader.show();
        return await this.servicoService.getServicoById(+id);
      } catch (error) {
        this.toaster.showDanger('Erro ao buscar serviço!');

        console.error('Erro ao buscar serviço:', error);
        return null; // ou redirecione para uma página de erro
      } finally {
        
        this.loader.hide();
      }
    }
    return null;
  }
}
