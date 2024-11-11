Na próxima etapa, vamos iniciar a **implementação do backend**, partindo da criação das entidades, repositórios, serviços e controladores. Vou detalhar as principais tarefas para cada componente do backend, incluindo os detalhes dos métodos para gerar relatórios.

---

### **Etapa 2: Implementação do Backend**

#### **1. Criação das Entidades e Relacionamentos**

No sistema de relatórios, vamos utilizar entidades já existentes como `Servico`, `Cliente`, `Mecanico`, e `Peca`, além de criar as estruturas de DTO necessárias para cada relatório. Se ainda não estiverem completas, as entidades devem incluir os atributos necessários para responder aos requisitos dos relatórios, como datas, status, e atributos financeiros.

1. **Verifique e ajuste as entidades**:
   - **Cliente**: Deve incluir nome, contato e ID.
   - **Servico**: Deve conter descrição, status, mecânico responsável, data de agendamento, tempo estimado e final, custo estimado e final.
   - **Peca**: Necessita de nome, quantidade, valor unitário e relação com o serviço.
   - **Mecanico**: ID e nome, além de um relacionamento com serviços realizados.

#### **2. Configuração dos Repositórios**

Para manipulação de dados no banco, cada entidade terá seu repositório com consultas específicas para os relatórios.

- **ClienteRepository**: Consultas para buscar clientes mais frequentes e o total gasto.
- **ServicoRepository**: Consultas para calcular o tempo e custo de serviços, bem como filtrar por datas e status.
- **MecanicoRepository**: Consultas para verificar o número de serviços realizados e o tempo/custo real vs. estimado.
- **PecaRepository**: Consultas para identificar a quantidade e custo total de peças usadas.

Exemplo de consulta customizada no `ServicoRepository` para relatórios:
```java
@Query("SELECT new com.example.RelatorioServicoDTO(s.descricaoProblema, s.status, s.dataAgendada, m.nome, s.tempoEstimado, s.custoEstimado, s.custoFinal) " +
       "FROM Servico s JOIN s.mecanico m WHERE s.dataAgendada BETWEEN :dataInicio AND :dataFim AND s.status = :status")
List<RelatorioServicoDTO> findRelatorioServicos(@Param("dataInicio") LocalDate dataInicio,
                                                @Param("dataFim") LocalDate dataFim,
                                                @Param("status") String status);
```

#### **3. Desenvolvimento dos Serviços (Services)**

Cada relatório terá um serviço correspondente para processar as consultas e aplicar a lógica de negócios. Exemplo de serviços:

1. **RelatorioServicoService**: Processa o relatório de serviços por período, status e mecânico.
2. **RelatorioPecasService**: Retorna a quantidade e custo total das peças.
3. **RelatorioFinanceiroService**: Calcula receitas e despesas, aplicando filtros de período e status de pagamento.
4. **RelatorioFidelizacaoService**: Calcula a frequência de retorno dos clientes e o gasto total.

**Exemplo de Lógica no RelatorioServicoService:**
```java
@Service
public class RelatorioServicoService {
    @Autowired
    private ServicoRepository servicoRepository;

    public List<RelatorioServicoDTO> gerarRelatorioServicos(LocalDate dataInicio, LocalDate dataFim, String status) {
        return servicoRepository.findRelatorioServicos(dataInicio, dataFim, status);
    }
}
```

#### **4. Configuração dos Controladores (Controllers)**

Cada relatório será exposto por um endpoint específico no controlador `RelatorioController`. O controlador vai receber os parâmetros da requisição, como `dataInicio`, `dataFim`, e outros filtros, e invocar os métodos dos serviços para processar os dados.

- **RelatorioController**: Controlador central para o módulo de relatórios. Endpoints:
   - `GET /relatorios/servicos`
   - `GET /relatorios/desempenho-mecanicos`
   - `GET /relatorios/pecas-utilizadas`
   - `GET /relatorios/financeiro`
   - `GET /relatorios/fidelizacao-clientes`

**Exemplo de Endpoint para Relatório de Serviços:**
```java
@RestController
@RequestMapping("/relatorios")
public class RelatorioController {

    @Autowired
    private RelatorioServicoService relatorioServicoService;

    @GetMapping("/servicos")
    public ResponseEntity<List<RelatorioServicoDTO>> relatorioServicos(
            @RequestParam LocalDate dataInicio,
            @RequestParam LocalDate dataFim,
            @RequestParam(required = false) String status) {
        List<RelatorioServicoDTO> relatorio = relatorioServicoService.gerarRelatorioServicos(dataInicio, dataFim, status);
        return ResponseEntity.ok(relatorio);
    }
}
```

#### **5. Testes Unitários e Integração**

Após a criação dos serviços e endpoints, devem ser implementados testes para garantir que cada relatório funcione como esperado.

- **Testes de Unidade**: Testam cada método de serviço de forma isolada, simulando o comportamento dos repositórios.
- **Testes de Integração**: Testam os endpoints do controlador, verificando se os dados são processados corretamente e se os filtros aplicados retornam resultados corretos.

---

### **6. Integração com Swagger para Documentação dos Endpoints**

Use o Swagger para expor a documentação automaticamente. No Swagger, cada endpoint será documentado com exemplos de solicitações e respostas para facilitar o uso dos relatórios por desenvolvedores e integradores.

---

### **Conclusão da Etapa**

Após essa etapa, teremos o backend do módulo de relatórios funcional e testado, pronto para integração com o frontend. A próxima etapa do roteiro envolverá a **implementação do frontend**, onde desenvolveremos a interface de usuário para exibir e personalizar os relatórios gerados.