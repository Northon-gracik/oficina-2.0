-- Função para criar as tabelas em todos os schemas exceto 'public'
CREATE OR REPLACE FUNCTION create_tables_in_schemas()
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
        -- Criar tabela Servico
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.servico (
                id BIGSERIAL PRIMARY KEY,
                descricao VARCHAR(255),
                data_inicio TIMESTAMP WITH TIME ZONE,
                data_conclusao TIMESTAMP WITH TIME ZONE,
                status VARCHAR(50),
                mecanico_id BIGINT,
                custo_estimado DECIMAL(10, 2),
                custo_final DECIMAL(10, 2),
                tempo_estimado NUMERIC,
                tempo_real NUMERIC,
                notas TEXT,
                forma_pagamento VARCHAR(50),
                status_pagamento VARCHAR(50),
                valor_pagamento DECIMAL(10, 2),
                vehicle_id BIGINT,
                agendamento_id BIGINT,
                inspecao_entrada_id BIGINT,
                orcamento_id BIGINT,
                manutencao_id BIGINT,
                inspecao_saida_id BIGINT,
                entrega_id BIGINT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', schema_name);

        -- Criar tabela Inspecao
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.inspecao (
                id BIGSERIAL PRIMARY KEY,
                data_inspecao TIMESTAMP WITH TIME ZONE,
                responsavel_inspecao VARCHAR(255),
                observacoes TEXT,
                nivel_combustivel BIGINT,
                quilometragem VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', schema_name);

        -- Criar tabela Item da Inspecao
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.item_inspecao (
                inspecao_id BIGINT NOT NULL,
                item_nome VARCHAR(255) NOT NULL,
                item_presente BOOLEAN,
                PRIMARY KEY (inspecao_id, item_nome),
                FOREIGN KEY (inspecao_id) REFERENCES %I.inspecao(id)
            )', schema_name, schema_name);

        -- Criar tabela Orcamento
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.orcamento (
                id BIGSERIAL PRIMARY KEY,
                data_criacao TIMESTAMP WITH TIME ZONE,
                data_prevista TIMESTAMP WITH TIME ZONE,
                data_validade TIMESTAMP WITH TIME ZONE,
                custo_total_estimado DECIMAL(10, 2),
                status VARCHAR(50),
                responsavel_emissao VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', schema_name);

        -- Criar tabela ItensAFazer
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.item_a_fazer (
                id BIGSERIAL PRIMARY KEY,
                descricao VARCHAR(255),
                tipo_mecanico VARCHAR(50),
                status_manutencao VARCHAR(50),
                tipo_manutencao VARCHAR(50),
                valor_total_pecas DECIMAL(10, 2),
                valor_mao_de_obra DECIMAL(10, 2),
                tempo_estimado NUMERIC,
                hora_inicio TIMESTAMP,
                hora_fim TIMESTAMP,
                orcamento_id BIGINT,
                manutencao_id BIGINT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', schema_name);

        -- Criar tabela Peca
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.peca (
                id BIGSERIAL PRIMARY KEY,
                nome VARCHAR(255),
                descricao TEXT,
                valor_unitario DECIMAL(10, 2),
                quantidade INTEGER,
                part_number VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', schema_name);

        -- Criar tabela Agendamento
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.agendamento (
                id BIGSERIAL PRIMARY KEY,
                data_agendamento TIMESTAMP WITH TIME ZONE,
                descricao_problema TEXT,
                status VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', schema_name);

        -- Criar tabela Entrega
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.entrega (
                id BIGSERIAL PRIMARY KEY,
                responsavel_entrega VARCHAR(255),
                data_entrega TIMESTAMP WITH TIME ZONE,
                observacoes_entrega TEXT,
                quilometragem_entrega BIGINT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', schema_name);

        -- Criar tabela Manutencao
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.manutencao (
                id BIGSERIAL PRIMARY KEY,
                data_inicio TIMESTAMP WITH TIME ZONE,
                data_conclusao TIMESTAMP WITH TIME ZONE,
                descricao_detalhada TEXT,
                custos_reais DECIMAL(10, 2),
                comentarios_observacoes TEXT,
                tecnico_responsavel VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', schema_name);

        -- Criar funções e triggers para atualizar o campo updated_at em todas as tabelas
        DECLARE
            table_name TEXT;
        BEGIN
            FOR table_name IN 
                SELECT unnest(ARRAY['servico', 'inspecao', 'orcamento', 'item_a_fazer', 'peca', 'agendamento', 'entrega', 'manutencao'])
            LOOP
                EXECUTE format('
                    CREATE OR REPLACE FUNCTION %I.update_%I_updated_at()
                    RETURNS TRIGGER AS $func$
                    BEGIN
                        NEW.updated_at = CURRENT_TIMESTAMP;
                        RETURN NEW;
                    END;
                    $func$ LANGUAGE plpgsql', schema_name, table_name);
                
                EXECUTE format('
                    DROP TRIGGER IF EXISTS trigger_update_%I_updated_at ON %I.%I;
                    CREATE TRIGGER trigger_update_%I_updated_at
                    BEFORE UPDATE ON %I.%I
                    FOR EACH ROW
                    EXECUTE FUNCTION %I.update_%I_updated_at()', 
                    table_name, schema_name, table_name, table_name, schema_name, table_name, schema_name, table_name);
            END LOOP;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Executar a função para criar as tabelas em todos os schemas existentes
SELECT create_tables_in_schemas();

-- Criar uma função que será chamada sempre que um novo schema for criado
CREATE OR REPLACE FUNCTION create_tables_on_new_schema()
RETURNS event_trigger AS $$
DECLARE
    obj record;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands() WHERE command_tag = 'CREATE SCHEMA'
    LOOP
        -- Criar todas as tabelas no novo schema
        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.servico (
                id BIGSERIAL PRIMARY KEY,
                descricao VARCHAR(255),
                data_inicio TIMESTAMP WITH TIME ZONE,
                data_conclusao TIMESTAMP WITH TIME ZONE,
                status VARCHAR(50),
                mecanico_id BIGINT,
                custo_estimado DECIMAL(10, 2),
                custo_final DECIMAL(10, 2),
                tempo_estimado INTEGER,
                tempo_real INTEGER,
                notas TEXT,
                forma_pagamento VARCHAR(50),
                status_pagamento VARCHAR(50),
                valor_pagamento DECIMAL(10, 2),
                vehicle_id BIGINT,
                agendamento_id BIGINT,
                inspecao_entrada_id BIGINT,
                orcamento_id BIGINT,
                manutencao_id BIGINT,
                inspecao_saida_id BIGINT,
                entrega_id BIGINT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', obj.object_identity);

        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.inspecao (
                id BIGSERIAL PRIMARY KEY,
                data_inspecao TIMESTAMP WITH TIME ZONE,
                responsavel_inspecao VARCHAR(255),
                observacoes TEXT,
                nivel_combustivel BIGINT,
                quilometragem VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', obj.object_identity);

        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.item_inspecao (
                inspecao_id BIGINT NOT NULL,
                item_nome VARCHAR(255) NOT NULL,
                item_presente BOOLEAN,
                PRIMARY KEY (inspecao_id, item_nome),
                FOREIGN KEY (inspecao_id) REFERENCES %I.inspecao(id)
            )', obj.object_identity, obj.object_identity);

        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.orcamento (
                id BIGSERIAL PRIMARY KEY,
                data_criacao TIMESTAMP WITH TIME ZONE,
                data_prevista TIMESTAMP WITH TIME ZONE,
                data_validade TIMESTAMP WITH TIME ZONE,
                custo_total_estimado DECIMAL(10, 2),
                status VARCHAR(50),
                responsavel_emissao VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', obj.object_identity);

        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.item_a_fazer (
                id BIGSERIAL PRIMARY KEY,
                descricao VARCHAR(255),
                tipo_mecanico VARCHAR(50),
                status_manutencao VARCHAR(50),
                tipo_manutencao VARCHAR(50),
                valor_total_pecas DECIMAL(10, 2),
                valor_mao_de_obra DECIMAL(10, 2),
                tempo_estimado NUMERIC,
                hora_inicio TIMESTAMP,
                hora_fim TIMESTAMP,
                orcamento_id BIGINT,
                manutencao_id BIGINT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', obj.object_identity);

        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.peca (
                id BIGSERIAL PRIMARY KEY,
                nome VARCHAR(255),
                descricao TEXT,
                valor_unitario DECIMAL(10, 2),
                quantidade INTEGER,
                part_number VARCHAR(255),
                item_a_fazer_id BIGINT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', obj.object_identity);

        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.agendamento (
                id BIGSERIAL PRIMARY KEY,
                data_agendamento TIMESTAMP WITH TIME ZONE,
                descricao_problema TEXT,
                status VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', obj.object_identity);

        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.entrega (
                id BIGSERIAL PRIMARY KEY,
                responsavel_entrega VARCHAR(255),
                data_entrega TIMESTAMP WITH TIME ZONE,
                observacoes_entrega TEXT,
                quilometragem_entrega BIGINT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', obj.object_identity);

        EXECUTE format('
            CREATE TABLE IF NOT EXISTS %I.manutencao (
                id BIGSERIAL PRIMARY KEY,
                data_inicio TIMESTAMP WITH TIME ZONE,
                data_conclusao TIMESTAMP WITH TIME ZONE,
                descricao_detalhada TEXT,
                custos_reais DECIMAL(10, 2),
                comentarios_observacoes TEXT,
                tecnico_responsavel VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )', obj.object_identity);

        -- Criar funções e triggers para atualizar o campo updated_at em todas as tabelas do novo schema
        DECLARE
            table_name TEXT;
        BEGIN
            FOR table_name IN 
                SELECT unnest(ARRAY['servico', 'inspecao', 'orcamento', 'item_a_fazer', 'peca', 'agendamento', 'entrega', 'manutencao'])
            LOOP
                EXECUTE format('
                    CREATE OR REPLACE FUNCTION %I.update_%I_updated_at()
                    RETURNS TRIGGER AS $func$
                    BEGIN
                        NEW.updated_at = CURRENT_TIMESTAMP;
                        RETURN NEW;
                    END;
                    $func$ LANGUAGE plpgsql', obj.object_identity, table_name);
                
                EXECUTE format('
                    CREATE TRIGGER trigger_update_%I_updated_at
                    BEFORE UPDATE ON %I.%I
                    FOR EACH ROW
                    EXECUTE FUNCTION %I.update_%I_updated_at()', 
                    table_name, obj.object_identity, table_name, obj.object_identity, table_name);
            END LOOP;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Criar o event trigger que chama a função quando um novo schema é criado
DROP EVENT TRIGGER IF EXISTS create_tables_on_schema_creation;
CREATE EVENT TRIGGER create_tables_on_schema_creation
ON ddl_command_end
WHEN TAG IN ('CREATE SCHEMA')
EXECUTE FUNCTION create_tables_on_new_schema();
