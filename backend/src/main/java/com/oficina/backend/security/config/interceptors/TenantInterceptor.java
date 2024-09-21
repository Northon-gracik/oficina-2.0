package com.oficina.backend.security.config.interceptors;

import java.util.Optional;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.oficina.backend.entitities.Company;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class TenantInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Optional.ofNullable(request.getAttribute("authenticatedCompany"))
                .map(company -> ((Company) company).getSchema())
                .map(String::toUpperCase)
                .ifPresent(TenantContext::setCurrentTenant);
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        TenantContext.clear();
    }
}

/*
Este código implementa um interceptor de tenant (inquilino) para uma aplicação multi-tenant.

Explicação:
1. A classe TenantInterceptor implementa HandlerInterceptor, permitindo interceptar requisições HTTP.
2. No método preHandle, ele extrai o valor do cabeçalho "tenant" da requisição.
3. Se o cabeçalho existir, o valor é convertido para maiúsculas e definido como o tenant atual usando TenantContext.
4. O método postHandle limpa o contexto do tenant após o processamento da requisição.
5. Isso permite que a aplicação gerencie diferentes tenants (inquilinos) com base no cabeçalho da requisição.
*/