Para a documentação técnica do módulo de relatórios no sistema de oficinas, vamos detalhar os principais aspectos, incluindo a descrição dos endpoints, estrutura dos DTOs, e a lógica de cada relatório. Essa documentação serve tanto para desenvolvedores quanto para usuários de API que desejam entender como utilizar os relatórios de maneira eficaz.

---

## **Documentação Técnica do Módulo de Relatórios**

### **1. Visão Geral do Módulo de Relatórios**

O módulo de relatórios fornece dados analíticos do sistema, permitindo acompanhar informações detalhadas sobre serviços, peças, desempenho de mecânicos, fluxo financeiro e fidelização de clientes. Cada relatório tem filtros específicos e organiza os dados conforme solicitado, sendo acessível por endpoints RESTful.

---

### **2. Estrutura dos Relatórios**

Cada relatório possui uma interface padronizada e utiliza DTOs (Data Transfer Objects) para responder com dados específicos. Os filtros e critérios de busca são enviados por parâmetros de URL.

### **3. Endpoints de Relatório**

Abaixo, estão listados os endpoints principais e as descrições dos relatórios disponíveis.

#### **3.1. Relatório de Agendamentos e Serviços**
   - **Endpoint**: `GET /relatorios/servicos`
   - **Descrição**: Este relatório exibe serviços agendados e em andamento, com detalhes de status, descrição do problema e mecânico responsável.
   - **Parâmetros**:
     - `dataInicio` (LocalDate): Data inicial do período de busca.
     - `dataFim` (LocalDate): Data final do período de busca.
     - `status` (String, opcional): Status do serviço (e.g., "agendado", "em andamento", "concluído").
   - **Exemplo de Resposta**:
     ```json
     [
       {
         "descricaoProblema": "Troca de óleo e filtro",
         "status": "concluído",
         "dataAgendada": "2024-10-01",
         "mecanico": "João Silva",
         "tempoEstimado": 2,
         "custoEstimado": 200.0,
         "custoFinal": 180.0
       }
     ]
     ```

#### **3.2. Relatório de Desempenho dos Mecânicos**
   - **Endpoint**: `GET /relatorios/desempenho-mecanicos`
   - **Descrição**: Avalia a performance dos mecânicos com base nos serviços realizados, incluindo tempo e custo estimado versus tempo e custo real.
   - **Parâmetros**:
     - `dataInicio` (LocalDate): Data inicial do período de busca.
     - `dataFim` (LocalDate): Data final do período de busca.
     - `mecanicoId` (Long, opcional): ID do mecânico específico.
   - **Exemplo de Resposta**:
     ```json
     [
       {
         "mecanico": "Maria Souza",
         "servicosRealizados": 15,
         "tempoTotalEstimado": 40,
         "tempoTotalReal": 42,
         "custoTotalEstimado": 5000.0,
         "custoTotalReal": 4800.0,
         "eficiencia": 95.0
       }
     ]
     ```

#### **3.3. Relatório de Peças Utilizadas**
   - **Endpoint**: `GET /relatorios/pecas-utilizadas`
   - **Descrição**: Detalha as peças utilizadas nos serviços realizados, incluindo quantidades e custo total.
   - **Parâmetros**:
     - `dataInicio` (LocalDate): Data inicial do período de busca.
     - `dataFim` (LocalDate): Data final do período de busca.
     - `tipoPeca` (String, opcional): Tipo específico de peça.
   - **Exemplo de Resposta**:
     ```json
     [
       {
         "peca": "Filtro de Óleo",
         "quantidadeTotal": 25,
         "custoTotal": 625.0
       }
     ]
     ```

#### **3.4. Relatório Financeiro**
   - **Endpoint**: `GET /relatorios/financeiro`
   - **Descrição**: Fornece uma visão geral das receitas e despesas no período selecionado, considerando pagamentos realizados e custos totais de peças e serviços.
   - **Parâmetros**:
     - `dataInicio` (LocalDate): Data inicial do período de busca.
     - `dataFim` (LocalDate): Data final do período de busca.
     - `statusPagamento` (String, opcional): Status do pagamento (e.g., "pago", "pendente").
   - **Exemplo de Resposta**:
     ```json
     {
       "receitaTotal": 15000.0,
       "despesaTotal": 10500.0,
       "lucro": 4500.0,
       "pagamentosRealizados": 80,
       "pagamentosPendentes": 5
     }
     ```

#### **3.5. Relatório de Fidelização de Clientes**
   - **Endpoint**: `GET /relatorios/fidelizacao-clientes`
   - **Descrição**: Identifica clientes que mais utilizam os serviços da oficina, com base no número de visitas e valor gasto.
   - **Parâmetros**:
     - `dataInicio` (LocalDate): Data inicial do período de busca.
     - `dataFim` (LocalDate): Data final do período de busca.
     - `clienteId` (Long, opcional): ID de um cliente específico.
   - **Exemplo de Resposta**:
     ```json
     [
       {
         "cliente": "Ana Pereira",
         "totalServicos": 8,
         "gastoTotal": 3200.0,
         "tempoMedioRetorno": 45
       }
     ]
     ```

---

### **4. Estrutura de Dados e DTOs**

Para cada relatório, os dados são estruturados em DTOs específicos que encapsulam apenas os campos necessários. Exemplos:

- **RelatorioServicoDTO**:
   ```java
   public class RelatorioServicoDTO {
       private String descricaoProblema;
       private String status;
       private LocalDate dataAgendada;
       private String mecanico;
       private int tempoEstimado;
       private double custoEstimado;
       private double custoFinal;
       // Getters e Setters
   }
   ```

- **RelatorioPecasDTO**:
   ```java
   public class RelatorioPecasDTO {
       private String peca;
       private int quantidadeTotal;
       private double custoTotal;
       // Getters e Setters
   }
   ```

---

### **5. Lógica de Consultas e Filtros**

- **Filtros por Período**: Todos os relatórios implementam filtros por `dataInicio` e `dataFim`, permitindo a definição de um intervalo para geração do relatório.
- **Agrupamento e Agregações**: Alguns relatórios usam agregações, como soma e média, para valores como custo e quantidade. Exemplo: Relatório Financeiro agrega custos e lucros, enquanto o relatório de peças agrega quantidades totais de peças utilizadas.
- **Paginação e Limite**: Para relatórios extensos, como fidelização de clientes, considere a aplicação de paginação com parâmetros `page` e `size`.

---

### **6. Padrões de Retorno e Erros**

- **Formato de Resposta**: Todas as respostas são retornadas em JSON, com códigos de status HTTP apropriados (`200 OK`, `400 Bad Request`, etc.).
- **Tratamento de Erros**:
   - Erros de filtro inválido ou campos ausentes retornam um erro `400 Bad Request` com uma mensagem específica.
   - Se o relatório não encontrar dados no intervalo de datas, retornará uma resposta vazia `[]` ou um objeto com os campos zerados.

---

### **7. Exemplos de Uso dos Endpoints**

#### Exemplo de Solicitação para o Relatório de Serviços:
```
GET /relatorios/servicos?dataInicio=2024-01-01&dataFim=2024-01-31&status=concluido
```

#### Exemplo de Solicitação para o Relatório Financeiro:
```
GET /relatorios/financeiro?dataInicio=2024-01-01&dataFim=2024-01-31&statusPagamento=pago
```

---

### **8. Documentação com Swagger**

Para simplificar a consulta e teste dos endpoints, o Swagger pode ser utilizado para expor a documentação do módulo de relatórios no próprio backend. No Swagger, cada endpoint será detalhado com parâmetros, exemplos de respostas, e tipos de retorno.

--- 

Esse guia cobre todos os aspectos técnicos para desenvolvimento, integração e consumo do módulo de relatórios, garantindo consistência nos dados e flexibilidade de uso.