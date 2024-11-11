package com.oficina.backend.security.authentication;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator.Builder;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
public class JwtTokenService {

    private static final String CLAIM_COMPANY_ID = "CLAIM_COMPANY";
    private static final String SECRET_KEY = "4Z^XrroxR@dWxqf$mTTKwW$!@#qGr4P"; // Chave secreta utilizada para gerar e verificar o token
    private static final String ISSUER = "pizzurg-api"; // Emissor do token
    private static final Algorithm ALGORITHM = Algorithm.HMAC256(SECRET_KEY);
    private static final ZoneId ZONE_ID = ZoneId.of("America/Recife");

    public String generateToken(String userEmail) {
        return generateToken(userEmail, null);
    }

    public String generateToken(String userEmail, Long companyId) {
        try {
            Builder tokenBuilder = JWT.create()
                    .withIssuer(ISSUER) // Define o emissor do token
                    .withIssuedAt(creationDate()) // Define a data de emissão do token
                    .withExpiresAt(expirationDate()) // Define a data de expiração do token
                    .withSubject(userEmail); // Define o assunto do token (neste caso, o email de usuário)

            if (companyId != null) {
                tokenBuilder.withClaim(CLAIM_COMPANY_ID, companyId);
            }

            return tokenBuilder.sign(ALGORITHM); // Assina o token usando o algoritmo especificado
        } catch (JWTCreationException exception) {
            throw new JWTCreationException("Erro ao gerar token!", exception);
        }
    }

    public String getSubjectFromToken(String token) {
        return getClaimFromToken(token, DecodedJWT::getSubject);
    }

    public Long getCompanyId(String token) {
        return getClaimFromToken(token, jwt -> {
            var claim = jwt.getClaim(CLAIM_COMPANY_ID);
            return claim.isNull() ? null : claim.asLong();
        });
    }

    private <T> T getClaimFromToken(String token, java.util.function.Function<DecodedJWT, T> claimResolver) {
        try {
            DecodedJWT jwt = getDecodedJWT(token);
            return claimResolver.apply(jwt);
        } catch (JWTVerificationException exception) {
            throw new JWTVerificationException("Token expirado!");
        }
    }

    public DecodedJWT getDecodedJWT(String token) {
        return JWT.require(ALGORITHM)
                .withIssuer(ISSUER) // Define o emissor do token
                .build()
                .verify(token); // Verifica a validade do token
    }
    
    private Instant creationDate() {
        return ZonedDateTime.now(ZONE_ID).toInstant();
    }

    private Instant expirationDate() {
        return ZonedDateTime.now(ZONE_ID).plusHours(4).toInstant();
    }
}
