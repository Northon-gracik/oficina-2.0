CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adiciona um índice para melhorar a performance de buscas por CPF e email
CREATE INDEX idx_users_cpf ON users (cpf);
CREATE INDEX idx_users_email ON users (email);

-- Adiciona uma restrição para garantir que o CPF tenha 11 caracteres
ALTER TABLE users ADD CONSTRAINT chk_users_cpf_length CHECK (LENGTH(cpf) = 11);

-- Adiciona uma restrição para garantir que o email tenha um formato válido
ALTER TABLE users ADD CONSTRAINT chk_users_email_format CHECK (email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');

-- Cria uma função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria um trigger para chamar a função de atualização
CREATE TRIGGER trigger_update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();