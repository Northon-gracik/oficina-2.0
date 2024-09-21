package com.oficina.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import jakarta.persistence.EntityManager;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;

@NoRepositoryBean
public class RepositorySchema<T, ID> extends SimpleJpaRepository<T, ID> {

    private final EntityManager entityManager;
    private final String schema;

    public RepositorySchema(JpaEntityInformation<T, ?> entityInformation, 
                            EntityManager entityManager,
                            String schema) {
        super(entityInformation, entityManager);
        this.entityManager = entityManager;
        this.schema = schema;
    }

    @Override
    public <S extends T> S save(S entity) {
        entityManager.createNativeQuery("SET search_path TO " + schema).executeUpdate();
        return super.save(entity);
    }

    // Override other methods as needed to set the schema before operations
}
