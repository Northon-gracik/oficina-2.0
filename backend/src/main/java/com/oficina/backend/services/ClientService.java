package com.oficina.backend.services;

import com.oficina.backend.entitities.Client;
import com.oficina.backend.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.util.regex.Pattern;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Optional<Client> getClientById(Long id) {
        return clientRepository.findById(id);
    }

    public Client saveClient(Client client) {
        validateClient(client, null);
        return clientRepository.save(client);
    }

    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }

    public Client updateClient(Long id, Client updatedClient) {
        Optional<Client> existingClientOpt = clientRepository.findById(id);
        if (existingClientOpt.isPresent()) {
            Client existingClient = existingClientOpt.get();
            validateClient(updatedClient, existingClient);
            existingClient.setNomeCompleto(updatedClient.getNomeCompleto());
            existingClient.setEndereco(updatedClient.getEndereco());
            existingClient.setNumeroTelefone(updatedClient.getNumeroTelefone());
            existingClient.setEmail(updatedClient.getEmail());
            existingClient.setDataNascimento(updatedClient.getDataNascimento());
            existingClient.setNumeroIdentificacao(updatedClient.getNumeroIdentificacao());
            return clientRepository.save(existingClient);
        }
        return null;
    }

    public Optional<Client> findByNumeroIdentificacao(String numeroIdentificacao) {
        return clientRepository.findByNumeroIdentificacao(numeroIdentificacao);
    }


    private void validateClient(Client client, Client existingClient) {
        if (client.getNomeCompleto() == null || client.getNomeCompleto().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome completo é obrigatório");
        }

        if (client.getEndereco() == null || client.getEndereco().trim().isEmpty()) {
            throw new IllegalArgumentException("Endereço é obrigatório");
        }

        if (client.getNumeroTelefone() == null || !Pattern.matches("\\d{10,11}", client.getNumeroTelefone().replaceAll("[^0-9]", ""))) {
            throw new IllegalArgumentException("Número de telefone inválido");
        }
        if (clientRepository.existsByNumeroTelefone(client.getNumeroTelefone()) &&
            (existingClient == null || !client.getNumeroTelefone().equals(existingClient.getNumeroTelefone()))) {
            throw new IllegalArgumentException("Número de telefone já cadastrado");
        }

        if (client.getEmail() == null || !Pattern.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", client.getEmail())) {
            throw new IllegalArgumentException("Email inválido");
        }
        if (clientRepository.existsByEmail(client.getEmail()) &&
            (existingClient == null || !client.getEmail().equals(existingClient.getEmail()))) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        if (client.getDataNascimento() == null || client.getDataNascimento().after(java.sql.Date.valueOf(LocalDate.now()))) {
            throw new IllegalArgumentException("Data de nascimento inválida");
        }

        String cleanedNumeroIdentificacao = client.getNumeroIdentificacao().replaceAll("[^0-9]", "");
        if (cleanedNumeroIdentificacao.isEmpty() || 
            (!Pattern.matches("\\d{11}", cleanedNumeroIdentificacao) && !Pattern.matches("\\d{14}", cleanedNumeroIdentificacao))) {
            throw new IllegalArgumentException("Número de identificação (CPF ou CNPJ) inválido");
        }
        if (clientRepository.existsByNumeroIdentificacao(cleanedNumeroIdentificacao) &&
            (existingClient == null || !cleanedNumeroIdentificacao.equals(existingClient.getNumeroIdentificacao().replaceAll("[^0-9]", "")))) {
            throw new IllegalArgumentException("Número de identificação já cadastrado");
        }

        // Validar idade mínima (por exemplo, 18 anos)
        LocalDate minAgeDate = LocalDate.now().minusYears(18);
        if (client.getDataNascimento().after(java.sql.Date.valueOf(minAgeDate))) {
            throw new IllegalArgumentException("Cliente deve ter pelo menos 18 anos");
        }

        // Validar tamanho máximo do nome
        if (client.getNomeCompleto().length() > 100) {
            throw new IllegalArgumentException("Nome completo não pode exceder 100 caracteres");
        }

        // Validar formato do CEP no endereço
        if (!Pattern.matches(".*\\d{5}-\\d{3}.*", client.getEndereco())) {
            throw new IllegalArgumentException("Endereço deve conter um CEP válido (formato: XXXXX-XXX)");
        }

        // Validar dígitos verificadores do CPF/CNPJ
        if (!isValidCpfCnpj(cleanedNumeroIdentificacao)) {
            throw new IllegalArgumentException("Número de CPF ou CNPJ inválido");
        }

        // Validar comprimento mínimo do nome
        if (client.getNomeCompleto().length() < 3) {
            throw new IllegalArgumentException("Nome completo deve ter pelo menos 3 caracteres");
        }

        // Validar formato do email com regex mais rigoroso
        if (!Pattern.matches("^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$", client.getEmail())) {
            throw new IllegalArgumentException("Formato de email inválido");
        }

        // Validar idade máxima (por exemplo, 120 anos)
        LocalDate maxAgeDate = LocalDate.now().minusYears(120);
        if (client.getDataNascimento().before(java.sql.Date.valueOf(maxAgeDate))) {
            throw new IllegalArgumentException("Data de nascimento inválida (idade máxima excedida)");
        }

        // Validar comprimento máximo do endereço
        if (client.getEndereco().length() > 200) {
            throw new IllegalArgumentException("Endereço não pode exceder 200 caracteres");
        }

        // Validar se o número de telefone contém apenas dígitos
        if (!client.getNumeroTelefone().matches("\\d+")) {
            throw new IllegalArgumentException("Número de telefone deve conter apenas dígitos");
        }

        // Validar formato do CEP no endereço
        if (!Pattern.matches(".*\\d{5}-\\d{3}.*", client.getEndereco())) {
            throw new IllegalArgumentException("Endereço deve conter um CEP válido (formato: XXXXX-XXX)");
        }

        // Validar se o nome contém apenas letras, espaços e acentos
        if (!client.getNomeCompleto().matches("^[\\p{L}\\s]+$")) {
            throw new IllegalArgumentException("Nome completo deve conter apenas letras e espaços");
        }

        // Validar se o endereço contém um número
        if (!Pattern.matches(".*\\d+.*", client.getEndereco())) {
            throw new IllegalArgumentException("Endereço deve conter um número");
        }

        // Validar se o email não contém caracteres especiais inválidos
        if (Pattern.matches(".*[<>()\\[\\]\\\\,;:\\s\"].*", client.getEmail()) || !client.getEmail().contains("@")) {
            throw new IllegalArgumentException("Email contém caracteres inválidos ou está faltando @");
        }

        // Validar se a data de nascimento não é uma data futura
        if (client.getDataNascimento().after(new java.util.Date())) {
            throw new IllegalArgumentException("Data de nascimento não pode ser uma data futura");
        }

        // Validar se o número de telefone não contém caracteres repetidos em excesso
        if (Pattern.matches(".*(\\d)\\1{4,}.*", client.getNumeroTelefone())) {
            throw new IllegalArgumentException("Número de telefone inválido (muitos dígitos repetidos)");
        }
    }

    // Método auxiliar para validar CPF/CNPJ
    private boolean isValidCpfCnpj(String numero) {
        if (numero == null || (numero.length() != 11 && numero.length() != 14)) {
            return false;
        }

        if (numero.length() == 11) {
            return isValidCPF(numero);
        } else {
            return isValidCNPJ(numero);
        }
    }

    private boolean isValidCPF(String cpf) {
        if (cpf.matches("(\\d)\\1{10}")) return false;

        int[] digits = new int[11];
        for (int i = 0; i < 11; i++) {
            digits[i] = Character.getNumericValue(cpf.charAt(i));
        }

        int sum = 0;
        for (int i = 0; i < 9; i++) {
            sum += digits[i] * (10 - i);
        }
        int firstDigit = 11 - (sum % 11);
        if (firstDigit > 9) firstDigit = 0;

        if (digits[9] != firstDigit) return false;

        sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += digits[i] * (11 - i);
        }
        int secondDigit = 11 - (sum % 11);
        if (secondDigit > 9) secondDigit = 0;

        return digits[10] == secondDigit;
    }

    private boolean isValidCNPJ(String cnpj) {
        if (cnpj.matches("(\\d)\\1{13}")) return false;

        int[] weights = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int sum = 0;
        for (int i = 0; i < 12; i++) {
            sum += Character.getNumericValue(cnpj.charAt(i)) * weights[i + 1];
        }
        int firstDigit = 11 - (sum % 11);
        if (firstDigit > 9) firstDigit = 0;

        if (Character.getNumericValue(cnpj.charAt(12)) != firstDigit) return false;

        sum = 0;
        for (int i = 0; i < 13; i++) {
            sum += Character.getNumericValue(cnpj.charAt(i)) * weights[i];
        }
        int secondDigit = 11 - (sum % 11);
        if (secondDigit > 9) secondDigit = 0;

        return Character.getNumericValue(cnpj.charAt(13)) == secondDigit;
    }
}
