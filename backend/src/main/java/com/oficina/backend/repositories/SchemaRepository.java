package com.oficina.backend.repositories;

import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SchemaRepository {

    @Autowired
    private DataSource dataSource;

    public void save(String schema) throws SQLException {
        PreparedStatement statement = dataSource.getConnection().prepareStatement("CREATE SCHEMA IF NOT EXISTS " + schema);

        statement.execute();
    }
}
