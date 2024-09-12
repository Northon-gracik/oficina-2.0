CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    schema VARCHAR(63) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adiciona um índice para melhorar a performance de buscas por CNPJ
CREATE INDEX idx_companies_cnpj ON companies (cnpj);

-- Adiciona uma restrição para garantir que o CNPJ tenha 14 caracteres
ALTER TABLE companies ADD CONSTRAINT chk_companies_cnpj_length CHECK (LENGTH(cnpj) = 14);

-- Adiciona uma restrição para garantir que o schema tenha um formato válido
ALTER TABLE companies ADD CONSTRAINT chk_companies_schema_format CHECK (schema ~ '^[a-z][a-z0-9_]*$');

-- Cria uma função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria um trigger para chamar a função de atualização
CREATE TRIGGER trigger_update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_companies_updated_at();