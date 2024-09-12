-- Cria a tabela user_roles
CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_user_roles_company FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Adiciona um índice para melhorar a performance de buscas por user_id e company_id
CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);
CREATE INDEX idx_user_roles_company_id ON user_roles (company_id);

-- Adiciona uma restrição para garantir que o role seja um valor válido
ALTER TABLE user_roles ADD CONSTRAINT chk_user_roles_role CHECK (role IN ('ROLE_CUSTOMER', 'ROLE_ADMINISTRATOR'));

-- Cria uma função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Cria um trigger para chamar a função de atualização
CREATE TRIGGER trigger_update_user_roles_updated_at
BEFORE UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION update_user_roles_updated_at();

-- Adiciona uma restrição única para evitar duplicatas de papel para um usuário em uma empresa
ALTER TABLE user_roles ADD CONSTRAINT uq_user_roles_user_company_role UNIQUE (user_id, company_id, role);
