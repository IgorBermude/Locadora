package com.example.DevWeb2.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class HelloApiControllerTests {

    @LocalServerPort
    int port;

    @Autowired
    TestRestTemplate restTemplate;

    @Test
    void helloEndpointReturnsMessageAndTimestamp(){
        @SuppressWarnings("unchecked")
        Map<String,Object> body = restTemplate.getForObject("/api/hello", Map.class);
        assertThat(body).isNotNull();
        assertThat(body).containsKeys("message","timestamp");
        assertThat(body.get("message")).as("message should be a non-empty string")
                .isInstanceOf(String.class)
                .asString().isNotBlank();
    }
}
