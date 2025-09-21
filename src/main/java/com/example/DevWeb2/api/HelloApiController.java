package com.example.DevWeb2.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HelloApiController {

    @GetMapping("/api/hello")
    public Map<String, Object> hello(){
        return Map.of(
                "message", "Backend Spring Boot está respondendo!",
                "timestamp", Instant.now().toString()
        );
    }
}

