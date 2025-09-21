# DevWeb2 - Spring Boot + Angular

## Visão Geral
Backend em Spring Boot com JPA + PostgreSQL (perfil dev) e H2 (perfil test), frontend Angular em `frontend/`. Estrutura pronta para evoluir com API REST, DTOs e segurança.

## O que está configurado
- JPA/Hibernate ativo (entidade `Customer`)
- Repositório via Spring Data JPA (`SpringDataCustomerRepository` + adapter)
- Perfis:
  - `dev`: PostgreSQL (configure URL/usuário/senha se necessário)
  - `test`: H2 em memória (usado automaticamente nos testes)
  - `memory` (opcional / legado): repositório em memória (não usado por padrão)
- Seed de dados em `dev` (classe `DataInitializer`)
- Endpoint REST de exemplo: `GET /api/hello`
- MVC Thymeleaf para `Customer` em `/customers`
- CORS liberado para `http://localhost:4200` (para integração Angular)
- Testes automatizados (contexto, endpoint hello e serviço de clientes)

## Estrutura
```
DevWeb2/
  pom.xml
  src/main/java/com/example/DevWeb2/
    domain/ (entidades)
    repository/ (interfaces + JPA adapter)
    service/ (regras de negócio)
    web/ (controllers MVC + REST)
    config/ (configurações: CORS, DataInitializer)
  src/test/java/... (testes JUnit)
  frontend/ (aplicação Angular)
```

## Rodar Backend (PostgreSQL - perfil dev)
Certifique-se de ter um banco criado (`devweb2`) e credenciais válidas em `application-dev.properties`.

```cmd
mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Se quiser sobrescrever variáveis via linha de comando:
```cmd
mvnw spring-boot:run -Dspring-boot.run.profiles=dev -Dspring-boot.run.arguments="--spring.datasource.username=meuuser --spring.datasource.password=minhasenha"
```

## Rodar Backend com H2 (testes rápidos / sandbox)
Normalmente apenas executando os testes:
```cmd
mvnw test
```
Ou subir app com H2 manualmente:
```cmd
mvnw spring-boot:run -Dspring-boot.run.profiles=test
```
Console H2 (se habilitar): adicionar `spring.h2.console.enabled=true` em `application-test.properties`.

## Rodar modo memória (legado / opcional)
Apenas se quiser rodar sem banco real:
```cmd
mvnw spring-boot:run -Dspring-boot.run.profiles=memory
```
(Não recomendado agora que JPA está estável.)

## Frontend Angular
```cmd
cd frontend
npm install
npm start
```
Acesse: http://localhost:4200
Chamadas para `/api/...` são proxied para o backend em http://localhost:8080.

## Testar Backend
```cmd
mvnw clean test
```
Usa o profile `test` (H2). As tabelas são criadas e destruídas por teste.

## Próximos Passos Recomendados
1. Expor API REST completa para `Customer` (ex: `/api/customers`) com DTOs.
2. Adicionar paginação e ordenação (Spring Data `Pageable`).
3. Implementar tratamento global de erros (`@ControllerAdvice`).
4. Adicionar segurança (Spring Security + JWT ou sessão) se necessário.
5. Introduzir migrations (Flyway ou Liquibase) em vez de `ddl-auto` em produção.
6. Criar camada de DTO + mapper (MapStruct ou records).
7. Estruturar melhor o Angular (routing, módulos feature, interceptors, guards).
8. Adicionar logs estruturados e métricas (Spring Boot Actuator + Micrometer).
9. Implementar testes de integração REST (MockMvc ou RestAssured) para /api futuros.

## Ajustes Opcionais de Limpeza
- Remover completamente o pacote `repository.memory` e `application-memory.properties` se não quiser mais fallback.
- Simplificar removendo o adapter JPA e injetando `SpringDataCustomerRepository` direto no service (apenas se não precisar de abstração extra).

## Variáveis de Ambiente (produção)
Sugestão para `application-prod.properties` (criar futuramente):
```
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
```

## Suporte
Peça exemplos de: DTO, controller REST paginado, migration Flyway, teste MockMvc, interceptor Angular.

---
Atualizado para refletir a configuração atual (JPA ativa com perfis).
