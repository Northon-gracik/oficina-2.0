package com.oficina.backend.util;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ErrorUtil {
    public static ResponseEntity<?> createErrorResponse(String message, Exception e, HttpStatus status) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", message);
        errorResponse.put("error", e.getMessage());
        errorResponse.put("status", status.value());
        return new ResponseEntity<>(errorResponse, status);
    }
}
