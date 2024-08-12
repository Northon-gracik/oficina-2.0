package com.oficina.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oficina.backend.entitities.Company;
import com.oficina.backend.entitities.User;
import com.oficina.backend.entitities.UserRole;
import java.util.List;


@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long>{
    List<UserRole> findByCompany(Company company);

    List<UserRole> findByUser(User user);
}
