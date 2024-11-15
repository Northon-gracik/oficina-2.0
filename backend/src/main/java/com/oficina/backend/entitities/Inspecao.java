package com.oficina.backend.entitities;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.Map;
import java.util.HashMap;
import java.util.Date;
import java.util.Collections;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Inspecao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_inspecao")
    private Date dataInspecao;

    @Column(name = "responsavel_inspecao")
    private String responsavelInspecao;

    @Column(name = "observacoes")
    private String observacoes;

    private String quilometragem;

    @ElementCollection
    @CollectionTable(name = "item_inspecao", joinColumns = @JoinColumn(name = "inspecao_id"))
    @Column(name = "item_presente")
    @MapKeyColumn(name = "item_nome")
    private Map<String, Boolean> checklistInspecao = new HashMap<>();

    @Column(name = "nivel_combustivel")
    private long nivelCombustivel;

    @Getter
    // Conjunto fixo de itens para o checklist
    public static final Map<String, Boolean> FIXED_ITEMS;

    // Inicializa o conjunto de itens
    static {
        Map<String, Boolean> items = new HashMap<>();
        items.put("antena", false);
        items.put("GPS", false);
        items.put("carregadorDeCelular", false);
        items.put("radioCd", false);
        items.put("documentos", false);
        items.put("calotas", false);
        items.put("tapetes", false);
        items.put("manual", false);
        items.put("estepe", false);
        items.put("pertences", false);
        items.put("iluminacaoInstrumentos", false);
        items.put("arCondicionado", false);
        items.put("setasLuzes", false);
        items.put("esguicho", false);
        items.put("vidrosRetrovizoresEletricos", false);
        items.put("buzina", false);
        items.put("lampadasInternas", false);
        items.put("etiquetaOleo", false);
        items.put("freioEstacionamento", false);
        items.put("pneus", false);
        items.put("palhetasLimpador", false);
        items.put("chaveDeRoda", false);
        items.put("macaco", false);
        items.put("triangulo", false);
        items.put("iluminacao", false);
        items.put("arrefecimento", false);
        items.put("fluidoFreio", false);
        items.put("oleoMotor", false);
        items.put("limpezaVidro", false);
        items.put("partidaFrio", false);
        items.put("bateria", false);
        items.put("alternador", false);
        items.put("oleoDirecao", false);

        // Torna o mapa imutável
        FIXED_ITEMS = Collections.unmodifiableMap(items);
    }

    // Construtor que inicializa a inspeção com o checklist fixo
    public Inspecao(Date dataInspecao, String responsavelInspecao, String observacoes,
            String quilometragem, long nivelCombustivel) {
        this.dataInspecao = dataInspecao;
        this.responsavelInspecao = responsavelInspecao;
        this.observacoes = observacoes;
        this.quilometragem = quilometragem;
        this.nivelCombustivel = nivelCombustivel;

        // Inicializa com o checklist padrão
        this.checklistInspecao = new HashMap<>(FIXED_ITEMS);
    }

    // Método para acessar o checklist imutável
    public Map<String, Boolean> getChecklistInspecao() {
        return Collections.unmodifiableMap(checklistInspecao);
    }

    // Método para modificar valores do checklist (somente os valores, não as
    // chaves)
    public void atualizarItemChecklist(String item, boolean presente) {
        if (checklistInspecao.containsKey(item)) {
            checklistInspecao.put(item, presente);
        } else {
            throw new IllegalArgumentException("Item não existente no checklist.");
        }
    }

}
