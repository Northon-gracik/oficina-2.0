import { Injectable } from '@angular/core';
import { IServico } from '../models/servicosModels';

@Injectable({
  providedIn: 'root',
})
export class EtapaService {
  verificarProximaEtapa(pServico: IServico, pEtapa: string): boolean {
    switch (pEtapa) {
      case 'agendamento':
        return EtapaService.isAgendamentoConcluido(pServico);
      case 'inspeção-entrada':
        return EtapaService.isInspecaoEntradaConcluida(pServico);
      case 'orçamento':
        return EtapaService.isOrcamentoConcluida(pServico);
      case 'manutenção':
        return EtapaService.isManutencaoConcluida(pServico);
      case 'inspeção-saída':
        return EtapaService.isInspecaoSaidaConcluida(pServico);
      case 'entrega':
        return EtapaService.isEntregaConcluida(pServico);
      // Adicione mais etapas conforme necessário
      default:
        return false;
    }
  }

  private static isAgendamentoConcluido(pServico: IServico): boolean {
    // Verificação de conclusão
    return true;
  }

  private static isInspecaoEntradaConcluida(pServico: IServico): boolean {
    // Verificação de conclusão
    return true;
  }

  public static isOrcamentoConcluida(pServico: IServico): boolean {
    
    return !!pServico.inspecaoEntrada;
  }

  public static isManutencaoConcluida(pServico: IServico): boolean {
    
    return !!pServico.orcamento;
  }

  public static isInspecaoSaidaConcluida(pServico: IServico): boolean {
    
    return !!pServico.manutencao && !!pServico.manutencao.dataConclusao;
  }

  public static isEntregaConcluida(pServico: IServico): boolean {
    
    return !!pServico.inspecaoSaida;
  }
}

