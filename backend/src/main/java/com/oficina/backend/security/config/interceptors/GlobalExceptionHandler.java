package com.oficina.backend.security.config.interceptors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.oficina.backend.util.ErrorUtil;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex) {
        return ErrorUtil.createErrorResponse("Erro ao processar a requisi o", ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
