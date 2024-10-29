import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAgendamento, IServico, IInspecao, IOrcamento, IItemAFazer, IPeca, IManutencao, IEntrega, StatusAgendamentoEnum, StatusManutencaoEnum } from '../models/servicosModels'; // Ajuste os models conforme necessário.
import { IVehicle } from '../models/IVehicle';

const baseUrl = 'http://localhost:8080/servicos';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  constructor(private http: HttpClient) { }

  // POST: Agendar serviço
  public agendarServico = (agendamento: IAgendamento): Promise<IServico | undefined> =>
    this.http.post<IServico>(baseUrl, agendamento).toPromise();

  // GET: Listar todos os serviços
  public getAllServicos = (): Promise<IServico[] | undefined> =>
    this.http.get<IServico[]>(baseUrl).toPromise();

  // GET: Buscar serviço por ID
  public getServicoById = (id: number): Promise<IServico | undefined> =>
    this.http.get<IServico>(`${baseUrl}/${id}`).toPromise();

  // POST: Identificar veículo
  public identificarVeiculo = (id: number, vehicleId: number): Promise<IServico | undefined> =>
    this.http.post<IServico>(`${baseUrl}/${id}/identificar-veiculo`, {id: vehicleId}).toPromise();

  // POST: Realizar inspeção de entrada
  public realizarInspecaoEntrada = (id: number, inspecao: IInspecao): Promise<IServico | undefined> =>
    this.http.post<IServico>(`${baseUrl}/${id}/inspecao-entrada`, inspecao).toPromise();

  // POST: Criar orçamento
  public criarOrcamento = (id: number, orcamento: IOrcamento | any): Promise<IServico | undefined> =>
    this.http.post<IServico>(`${baseUrl}/${id}/orcamento`, orcamento).toPromise();

  // POST: Inserir item no orçamento
  public inserirItemOrcamento = (id: number, item: IItemAFazer): Promise<IServico | undefined> =>
    this.http.post<IServico>(`${baseUrl}/${id}/orcamento/inserir-item`, item).toPromise();

  // POST: Inserir peça no item do orçamento
  public inserirPecaItemOrcamento = (id: number, itemId: number, peca: Omit<IPeca, 'id'>): Promise<IServico | undefined> =>
    this.http.post<IServico>(`${baseUrl}/${id}/orcamento/inserir-peca-item/${itemId}`, peca).toPromise();

  // POST: Iniciar manutenção
  public iniciarManutencao = (id: number, manutencao: IManutencao | any): Promise<IServico | undefined> =>
    this.http.post<IServico>(`${baseUrl}/${id}/iniciar-manutencao`, manutencao).toPromise();

  // POST: Inserir item na manutenção
  public inserirItemManutencao = (id: number, item: IItemAFazer): Promise<IServico | undefined> =>
    this.http.post<IServico>(`${baseUrl}/${id}/manutencao/inserir-item`, item).toPromise();

  // POST: Inserir peça no item da manutenção
  public inserirPecaItemManutencao = (id: number, itemId: number, peca: Omit<IPeca, 'id'>): Promise<IServico | undefined> =>
    this.http.post<IServico>(`${baseUrl}/${id}/manutencao/inserir-peca-item/${itemId}`, peca).toPromise();

  // POST: Mudar status de um item de manutenção
  public mudarStatusItem = (itemId: number, statusManutencao: StatusManutencaoEnum): Promise<void> =>
    this.http.post<void>(`${baseUrl}/mudar-status-item/${itemId}`, { statusManutencao }).toPromise();

  // PUT: Finalizar manutenção
  public finalizarManutencao = (id: number): Promise<IServico | undefined> =>
    this.http.put<IServico>(`${baseUrl}/${id}/finalizar-manutencao`, {}).toPromise();

  // POST: Realizar inspeção de saída
  public realizarInspecaoSaida = (id: number, inspecao: IInspecao): Promise<IServico | undefined> =>
    this.http.post<IServico>(`${baseUrl}/${id}/inspecao-saida`, inspecao).toPromise();

  // POST: Finalizar serviço
  public finalizarServico = (id: number, entrega: Omit<Omit<IEntrega, 'id'>,'dataEntrega'>): Promise<IServico | undefined> =>
    this.http.post<IServico>(`${baseUrl}/${id}/finalizar`, entrega).toPromise();

  // GET: Listar itens de inspeção
  public getListItemInspecao = (): Promise<string[] | undefined> =>
    this.http.get<string[]>(`${baseUrl}/listar-itens-inspecao`).toPromise();
  
  public getItem = (itemId: number): Promise<IItemAFazer | undefined> => 
    this.http.get<IItemAFazer>(`${baseUrl}/buscar-item/${itemId}`).toPromise();

  public realizarPagamento = (itemId: number, valorPagamento: number): Promise<IItemAFazer | undefined> => 
    this.http.post<IItemAFazer>(`${baseUrl}/${itemId}/pagamento`, {valorPagamento}).toPromise();
  
}
