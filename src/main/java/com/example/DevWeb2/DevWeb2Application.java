package com.example.DevWeb2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // removido exclude para ativar JPA/datasource
public class DevWeb2Application {

	public static void main(String[] args) {
		SpringApplication.run(DevWeb2Application.class, args);
	}
}
