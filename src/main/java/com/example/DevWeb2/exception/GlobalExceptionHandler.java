package com.example.DevWeb2.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.net.URI;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ProblemDetail baseProblem(HttpStatus status, String title, String detail, String instance) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        if (instance != null) pd.setInstance(URI.create(instance));
        pd.setProperty("timestamp", OffsetDateTime.now());
        return pd;
    }

    @ExceptionHandler(NotFoundException.class)
    public ProblemDetail handleNotFound(NotFoundException ex, HttpServletRequest req) {
        return baseProblem(HttpStatus.NOT_FOUND, "Recurso não encontrado", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleBusiness(BusinessException ex, HttpServletRequest req) {
        return baseProblem(HttpStatus.UNPROCESSABLE_ENTITY, "Regra de negócio violada", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        ProblemDetail pd = baseProblem(HttpStatus.BAD_REQUEST, "Dados inválidos", "Um ou mais campos estão inválidos.", req.getRequestURI());
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        fe -> fe.getField(),
                        fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "inválido",
                        (a,b) -> a,
                        HashMap::new
                ));
        pd.setProperty("errors", fieldErrors);
        return pd;
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ProblemDetail handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest req) {
        return baseProblem(HttpStatus.BAD_REQUEST, "Violação de restrição", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ProblemDetail handleUnreadable(HttpMessageNotReadableException ex, HttpServletRequest req) {
        return baseProblem(HttpStatus.BAD_REQUEST, "JSON inválido", "Formato do corpo da requisição inválido ou incompatível.", req.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ProblemDetail handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest req) {
        String msg = String.format("Parâmetro '%s' com valor '%s' é inválido para o tipo %s", ex.getName(), ex.getValue(), ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "desconhecido");
        return baseProblem(HttpStatus.BAD_REQUEST, "Parâmetro inválido", msg, req.getRequestURI());
    }

    @ExceptionHandler({HttpRequestMethodNotSupportedException.class})
    public ProblemDetail handleMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpServletRequest req) {
        return baseProblem(HttpStatus.METHOD_NOT_ALLOWED, "Método não suportado", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler({HttpMediaTypeNotSupportedException.class})
    public ProblemDetail handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex, HttpServletRequest req) {
        return baseProblem(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Mídia não suportada", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler({HttpMediaTypeNotAcceptableException.class})
    public ProblemDetail handleNotAcceptable(HttpMediaTypeNotAcceptableException ex, HttpServletRequest req) {
        return baseProblem(HttpStatus.NOT_ACCEPTABLE, "Não aceitável", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler({MissingServletRequestParameterException.class})
    public ProblemDetail handleMissingParam(MissingServletRequestParameterException ex, HttpServletRequest req) {
        String msg = String.format("Parâmetro obrigatório '%s' não informado", ex.getParameterName());
        return baseProblem(HttpStatus.BAD_REQUEST, "Parâmetro ausente", msg, req.getRequestURI());
    }

    @ExceptionHandler({EmptyResultDataAccessException.class, jakarta.persistence.EntityNotFoundException.class})
    public ProblemDetail handleRepoNotFound(RuntimeException ex, HttpServletRequest req) {
        return baseProblem(HttpStatus.NOT_FOUND, "Registro não encontrado", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest req) {
        String friendly = extractFriendlyMessage(ex);
        return baseProblem(HttpStatus.CONFLICT, "Violação de integridade", friendly, req.getRequestURI());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest req) {
        return baseProblem(HttpStatus.BAD_REQUEST, "Requisição inválida", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ProblemDetail handleIllegalState(IllegalStateException ex, HttpServletRequest req) {
        return baseProblem(HttpStatus.UNPROCESSABLE_ENTITY, "Regra de negócio inválida", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ProblemDetail handleNoSuchElement(NoSuchElementException ex, HttpServletRequest req) {
        return baseProblem(HttpStatus.NOT_FOUND, "Registro não encontrado", ex.getMessage(), req.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneric(Exception ex, HttpServletRequest req) {
        String errorId = UUID.randomUUID().toString();
        log.error("[{}] Erro inesperado no endpoint {}", errorId, req.getRequestURI(), ex);
        ProblemDetail pd = baseProblem(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno", "Ocorreu um erro inesperado. Se persistir, informe o código: " + errorId, req.getRequestURI());
        pd.setProperty("errorId", errorId);
        return pd;
    }

    private String extractFriendlyMessage(DataIntegrityViolationException ex) {
        String msg = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
        if (msg == null) return "Violação de restrição no banco de dados.";
        msg = msg.toLowerCase();
        if (msg.contains("not-null") || msg.contains("violates not-null constraint")) {
            return "Campo obrigatório ausente.";
        }
        if (msg.contains("unique") || msg.contains("duplicate")) {
            return "Valor duplicado para um campo que exige unicidade.";
        }
        if (msg.contains("foreign key") || msg.contains("violates foreign key constraint")) {
            return "Registro relacionado impede a operação (restrição de chave estrangeira).";
        }
        return "Operação não pôde ser concluída por restrições do banco de dados.";
    }
}
