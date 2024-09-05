package com.oficina.backend.security.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CorsConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:4200") // Defina a origem permitida
            .allowedMethods("GET", "POST", "PUT", "DELETE") // Defina os métodos HTTP permitidos
            .allowedHeaders("*"); // Defina os cabeçalhos permitidos
    }
}