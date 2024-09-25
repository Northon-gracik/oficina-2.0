package com.oficina.backend;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.sql.Date;
import java.time.LocalDate;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.oficina.backend.entitities.Client;
import com.oficina.backend.security.config.interceptors.TenantContext;
import com.oficina.backend.services.ClientService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@SpringBootTest
public class ClientTests {

    @Autowired
    private ClientService clientService;

    @MockBean
    private com.oficina.backend.security.config.interceptors.TenantInterceptor tenantInterceptor;

    private Client client;
    private HttpServletRequest request;
    private HttpServletResponse response;
    private Object handler;
    private String schema = "teste";

    @BeforeEach
    void setUp() throws Exception {
        client = new Client();
        client.setNomeCompleto("João da Silva");
        client.setEndereco("Rua Exemplo, 123, 12345-678");
        client.setNumeroTelefone("11987654321");
        client.setEmail("joao@example.com");
        client.setDataNascimento(Date.valueOf(LocalDate.now().minusYears(30)));
        client.setNumeroIdentificacao("52998224725"); // CPF válido

        // Mock do interceptor
        request = mock(HttpServletRequest.class);
        response = mock(HttpServletResponse.class);
        handler = new Object();

        // Configurar o interceptor para definir o schema
        when(request.getHeader("X-TenantID")).thenReturn("tenant1");
        doAnswer(invocation -> {
            // Simular a definição do schema
            // Na implementação real, isso seria feito no TenantInterceptor
            TenantContext.setCurrentTenant(schema);
            return true;
        }).when(tenantInterceptor).preHandle(request, response, handler);

        // Adicionar limpeza do contexto após o teste
        doAnswer(invocation -> {
            TenantContext.clear();
            return null;
        }).when(tenantInterceptor).afterCompletion(request, response, handler, null);
    }

    @AfterEach
    void tearDown() throws Exception {
        // Deletar o objeto após cada teste
        if (client != null && client.getId() != null) {
            clientService.deleteClient(client.getId());
        }
    }

    @Test
    public void testValidateClientInvalid() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);

        assertThrows(IllegalArgumentException.class, () -> {
            client.setNomeCompleto("");
            clientService.saveClient(client);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            client.setNomeCompleto("João da Silva");
            client.setEndereco("");
            clientService.saveClient(client);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            client.setEndereco("Rua Exemplo, 123, 12345-678");
            client.setNumeroTelefone("123");
            clientService.saveClient(client);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            client.setNumeroTelefone("11987654321");
            client.setEmail("invalid-email");
            clientService.saveClient(client);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            client.setEmail("joao@example.com");
            client.setDataNascimento(Date.valueOf(LocalDate.now().plusDays(1)));
            clientService.saveClient(client);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            client.setDataNascimento(Date.valueOf(LocalDate.now().minusYears(30)));
            client.setNumeroIdentificacao("123");
            clientService.saveClient(client);
        });
    }

    @Test
    public void testValidateClientIdadeMinima() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setDataNascimento(Date.valueOf(LocalDate.now().minusYears(17)));
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientTamanhoMaximoNome() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setNomeCompleto("a".repeat(101));
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientFormatoCEP() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setEndereco("Rua Sem CEP, 123");
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientDigitosVerificadoresCPFCNPJ() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setNumeroIdentificacao("12345678901");
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientComprimentoMinimoNome() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setNomeCompleto("Ab");
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientFormatoEmailRigoroso() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setEmail("email@.com");
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientIdadeMaxima() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setDataNascimento(Date.valueOf(LocalDate.now().minusYears(121)));
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientComprimentoMaximoEndereco() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setEndereco("a".repeat(201));
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientNumeroTelefoneApenasDigitos() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setNumeroTelefone("123abc456");
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientNomeApenasLetrasEspacos() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setNomeCompleto("João 123");
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientEnderecoContemNumero() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setEndereco("Rua Sem Número");
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientEmailCaracteresEspeciais() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setEmail("email<>@domain.com");
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientNumeroTelefoneDigitosRepetidos() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setNumeroTelefone("11111111111");
        assertThrows(IllegalArgumentException.class, () -> clientService.saveClient(client));
    }

    @Test
    public void testValidateClientCPFValido() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setNumeroIdentificacao("52998224725");
        Client savedClient = clientService.saveClient(client);
        assertDoesNotThrow(() -> clientService.getClientById(savedClient.getId()));
    }

    @Test
    public void testValidateClientCNPJValido() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        client.setNumeroIdentificacao("14603562000134");
        Client savedClient = clientService.saveClient(client);
        assertDoesNotThrow(() -> clientService.getClientById(savedClient.getId()));
    }

    @Test
    public void testValidateClientDadosValidos() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        Client savedClient = clientService.saveClient(client);
        assertDoesNotThrow(() -> clientService.getClientById(savedClient.getId()));
    }
}
