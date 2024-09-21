-- Função para criar a tabela cliente em todos os schemas exceto 'public'
CREATE OR REPLACE FUNCTION create_cliente_table_in_schemas()
RETURNS void AS $$
DECLARE
    schema_name TEXT;
BEGIN
    FOR schema_name IN 
        SELECT nspname 
        FROM pg_namespace 
        WHERE nspname != 'public' 
          AND nspname NOT LIKE 'pg_%' 
          AND nspname != 'information_schema'
    LOOP
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.cliente (
                id BIGSERIAL PRIMARY KEY,
                nome_completo VARCHAR(255) NOT NULL,
                endereco VARCHAR(255),
                numero_telefone VARCHAR(20),
                email VARCHAR(255),
                data_nascimento DATE,
                numero_identificacao VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', schema_name);
        
        -- Criar índice para melhorar a performance de buscas por email
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_cliente_email ON %I.cliente (email)', schema_name, schema_name);
        
        -- Criar função para atualizar o campo updated_at
        EXECUTE format('
            CREATE OR REPLACE FUNCTION %I.update_cliente_updated_at()
            RETURNS TRIGGER AS $func$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $func$ LANGUAGE plpgsql', schema_name);
        
        -- Criar trigger para chamar a função de atualização
        EXECUTE format('
            DROP TRIGGER IF EXISTS trigger_update_cliente_updated_at ON %I.cliente;
            CREATE TRIGGER trigger_update_cliente_updated_at
            BEFORE UPDATE ON %I.cliente
            FOR EACH ROW
            EXECUTE FUNCTION %I.update_cliente_updated_at()', schema_name, schema_name, schema_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Executar a função para criar a tabela em todos os schemas existentes
SELECT create_cliente_table_in_schemas();

-- Criar uma função que será chamada sempre que um novo schema for criado
CREATE OR REPLACE FUNCTION create_cliente_table_on_new_schema()
RETURNS event_trigger AS $$
DECLARE
    obj record;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands() WHERE command_tag = 'CREATE SCHEMA'
    LOOP
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.cliente (
                id BIGSERIAL PRIMARY KEY,
                nome_completo VARCHAR(255) NOT NULL,
                endereco VARCHAR(255),
                numero_telefone VARCHAR(20),
                email VARCHAR(255),
                data_nascimento DATE,
                numero_identificacao VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', obj.object_identity);
        
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_cliente_email ON %I.cliente (email)', obj.object_identity, obj.object_identity);
        
        EXECUTE format('
            CREATE OR REPLACE FUNCTION %I.update_cliente_updated_at()
            RETURNS TRIGGER AS $func$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $func$ LANGUAGE plpgsql', obj.object_identity);
        
        EXECUTE format('
            CREATE TRIGGER trigger_update_cliente_updated_at
            BEFORE UPDATE ON %I.cliente
            FOR EACH ROW
            EXECUTE FUNCTION %I.update_cliente_updated_at()', obj.object_identity, obj.object_identity);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Criar o event trigger que chama a função quando um novo schema é criado
CREATE EVENT TRIGGER create_cliente_table_on_schema_creation
ON ddl_command_end
WHEN TAG IN ('CREATE SCHEMA')
EXECUTE FUNCTION create_cliente_table_on_new_schema();