import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { IServico } from '../models/servicosModels';
import { EtapaService } from '../services/etapas.service';
import { Injectable } from '@angular/core';
import { ServicoService } from '../services/servico.service';
import { ToasterService } from '../../shared/components/toaster/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class servicoEtapasGuard implements CanActivate {
  constructor(private etapaService: EtapaService, private router: Router, private servicoService: ServicoService,
    private toaster: ToasterService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const idServico = route.parent?.params['id'];
    if (!idServico) {
      this.router.navigate(['/empresa/servico']);
      return false;
    }
    const servico = await this.servicoService.getServicoById(idServico);
    const etapaAtual = route.routeConfig?.path; // Captura a subrota (etapa atual)

    console.log({ etapaAtual, servico, parent });

    // Se os dados do serviço ou a etapa atual não estiverem disponíveis, redireciona para erro
    if (!servico) {
      this.router.navigate(['/empresa/servico']);
      this.toaster.showDanger('Serviço não encontrado!');
      return false;
    }

    const etapas = ['agendamento', 'inspeção-entrada', 'orçamento', 'manutenção', 'inspeção-saída', 'entrega'];

    if (!etapaAtual || (!etapas.includes(etapaAtual))) {
      this.router.navigate(['/empresa/servico']);
      this.toaster.showDanger('Etapa inexistente!');
      return false;
    }

    //Verifica se pode avançar para a próxima etapa com base nos dados do serviço
    const podeAvancar = this.etapaService.verificarProximaEtapa(servico, etapaAtual);

    if (!podeAvancar) {
      // this.router.navigate(['/dev']); // Redireciona se não puder acessar a etapa atual
      return false;
    }

    return true; // Permite o acesso se todas as condições forem atendidas
  }

}

