package com.oficina.backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.oficina.backend.entitities.Vehicle;
import com.oficina.backend.entitities.Client;
import com.oficina.backend.security.config.interceptors.TenantContext;
import com.oficina.backend.services.VehicleService;
import com.oficina.backend.services.ClientService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@SpringBootTest
public class VehicleTests {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private ClientService clientService;

    @MockBean
    private com.oficina.backend.security.config.interceptors.TenantInterceptor tenantInterceptor;

    private Vehicle vehicle;
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
        client.setDataNascimento(java.sql.Date.valueOf(LocalDate.now().minusYears(30)));
        client.setNumeroIdentificacao("52998224725");

        vehicle = new Vehicle();
        vehicle.setMarca("Toyota");
        vehicle.setModelo("Corolla");
        vehicle.setAno("2022");
        vehicle.setPlaca("ABC1D23");
        vehicle.setNumeroChassi("1HGBH41JXMN109186");
        vehicle.setCor("Preto");
        vehicle.setClient(client);

        // Mock do interceptor
        request = mock(HttpServletRequest.class);
        response = mock(HttpServletResponse.class);
        handler = new Object();

        // Configurar o interceptor para definir o schema
        when(request.getHeader("X-TenantID")).thenReturn("tenant1");
        doAnswer(invocation -> {
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
        if (vehicle != null && vehicle.getId() != null) {
            vehicleService.deleteVehicle(vehicle.getId());
        }
        if (client != null && client.getId() != null) {
            clientService.deleteClient(client.getId());
        }
    }

    @Test
    public void testValidateVehicleInvalid() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);

        assertThrows(IllegalArgumentException.class, () -> {
            vehicle.setMarca("");
            vehicleService.saveVehicle(vehicle);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            vehicle.setMarca("Toyota");
            vehicle.setModelo("");
            vehicleService.saveVehicle(vehicle);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            vehicle.setModelo("Corolla");
            vehicle.setAno("202");
            vehicleService.saveVehicle(vehicle);
        });

        // assertThrows(IllegalArgumentException.class, () -> {
        //     vehicle.setAno("2022");
        //     vehicle.setKm("-1");
        //     vehicleService.saveVehicle(vehicle);
        // });

        // assertThrows(IllegalArgumentException.class, () -> {
        //     vehicle.setKm("10000");
        //     vehicle.setPlaca("ABC123");
        //     vehicleService.saveVehicle(vehicle);
        // });

        assertThrows(IllegalArgumentException.class, () -> {
            vehicle.setPlaca("ABC1D23");
            vehicle.setNumeroChassi("12345");
            vehicleService.saveVehicle(vehicle);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            vehicle.setNumeroChassi("1HGBH41JXMN109186");
            vehicle.setCor("");
            vehicleService.saveVehicle(vehicle);
        });
    }

    @Test
    public void testValidateVehicleAnoFuturo() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        vehicle.setAno(String.valueOf(LocalDate.now().getYear() + 2));
        assertThrows(IllegalArgumentException.class, () -> vehicleService.saveVehicle(vehicle));
    }

    // @Test
    // public void testValidateVehicleKmNegativo() throws Exception {
    //     tenantInterceptor.preHandle(request, response, handler);
    //     vehicle.setKm("-1");
    //     assertThrows(IllegalArgumentException.class, () -> vehicleService.saveVehicle(vehicle));
    // }

    @Test
    public void testValidateVehiclePlacaInvalida() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        vehicle.setPlaca("ABC-1234");
        assertThrows(IllegalArgumentException.class, () -> vehicleService.saveVehicle(vehicle));
    }

    @Test
    public void testValidateVehicleNumeroChassiInvalido() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        vehicle.setNumeroChassi("ABCDEFGHIJKLMNOPQ");
        assertThrows(IllegalArgumentException.class, () -> vehicleService.saveVehicle(vehicle));
    }

    @Test
    public void testValidateVehicleCorInvalida() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        vehicle.setCor("CorMuitoLongaQueUltrapassaOLimiteDeCaracteres");
        assertThrows(IllegalArgumentException.class, () -> vehicleService.saveVehicle(vehicle));
    }

    @Test
    public void testValidateVehicleClienteInexistente() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        Client clienteInexistente = new Client();
        clienteInexistente.setId(9999L);
        vehicle.setClient(clienteInexistente);
        assertThrows(IllegalArgumentException.class, () -> vehicleService.saveVehicle(vehicle));
    }

    @Test
    public void testValidateVehicleDadosValidos() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        Client savedClient = clientService.saveClient(client);
        vehicle.setClient(savedClient);
        Vehicle savedVehicle = vehicleService.saveVehicle(vehicle);
        assertDoesNotThrow(() -> vehicleService.getVehicleById(savedVehicle.getId()));
    }

    @Test
    public void testUpdateVehicle() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        Client savedClient = clientService.saveClient(client);
        vehicle.setClient(savedClient);
        Vehicle savedVehicle = vehicleService.saveVehicle(vehicle);

        savedVehicle.setMarca("Honda");
        savedVehicle.setModelo("Civic");
        Vehicle updatedVehicle = vehicleService.updateVehicle(savedVehicle.getId(), savedVehicle);

        assertNotNull(updatedVehicle);
        assertEquals("Honda", updatedVehicle.getMarca());
        assertEquals("Civic", updatedVehicle.getModelo());
    }

    @Test
    public void testDeleteVehicle() throws Exception {
        tenantInterceptor.preHandle(request, response, handler);
        Client savedClient = clientService.saveClient(client);
        vehicle.setClient(savedClient);
        Vehicle savedVehicle = vehicleService.saveVehicle(vehicle);

        assertDoesNotThrow(() -> vehicleService.deleteVehicle(savedVehicle.getId()));
        assertFalse(vehicleService.getVehicleById(savedVehicle.getId()).isPresent());
    }
}
