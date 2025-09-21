package com.example.DevWeb2.config;

import com.example.DevWeb2.domain.Ator;
import com.example.DevWeb2.domain.Titulo;
import com.example.DevWeb2.repository.AtorRepository;
import com.example.DevWeb2.repository.TituloRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
@Profile("dev")
public class DataInitializer {
    // Adicionados como exemplo
    @Bean
    CommandLineRunner initData(AtorRepository atorRepository, TituloRepository tituloRepository){
        return args -> {
            if (atorRepository.count() == 0 && tituloRepository.count() == 0) {
                Titulo t1 = new Titulo(null, "Filme A", null);
                Titulo t2 = new Titulo(null, "Filme B", null);
                tituloRepository.saveAll(List.of(t1, t2));

                Ator a1 = new Ator(null, "Alice");
                Ator a2 = new Ator(null, "Bruno");
                Ator a3 = new Ator(null, "Carla");
                a1.getTitulos().add(t1);
                a2.getTitulos().add(t1);
                a2.getTitulos().add(t2);
                a3.getTitulos().add(t2);
                atorRepository.saveAll(List.of(a1,a2,a3));
            }
        };
    }
}
