/*package com.example.DevWeb2.config;

import com.example.DevWeb2.domain.*;
import com.example.DevWeb2.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            ClasseRepository classeRepo,
            DiretorRepository diretorRepo,
            TituloRepository tituloRepo,
            AtorRepository atorRepo,
            ItemRepository itemRepo
    ) {
        return args -> {
            // --- Criando Classes ---
            Classe c1 = new Classe();
            c1.setNome("Comédia");
            c1.setValor(BigDecimal.valueOf(10.0));
            c1.setDataDevolucao(LocalDate.now().plusDays(7));

            Classe c2 = new Classe();
            c2.setNome("Ação");
            c2.setValor(BigDecimal.valueOf(15.0));
            c2.setDataDevolucao(LocalDate.now().plusDays(5));

            classeRepo.saveAll(List.of(c1, c2));

            // --- Criando Diretores ---
            Diretor d1 = new Diretor();
            d1.setNome("Diretor A");

            Diretor d2 = new Diretor();
            d2.setNome("Diretor B");

            diretorRepo.saveAll(List.of(d1, d2));

            // --- Criando Títulos ---
            Titulo t1 = new Titulo();
            t1.setNome("Filme A");
            t1.setClasse(c1);   // Agora funciona
            t1.setDiretor(d1);  // Agora funciona

            Titulo t2 = new Titulo();
            t2.setNome("Filme B");
            t2.setClasse(c2);
            t2.setDiretor(d2);

            tituloRepo.saveAll(List.of(t1, t2));

            // --- Criando Atores ---
            Ator a1 = new Ator();
            a1.setNome("Ator 1");

            Ator a2 = new Ator();
            a2.setNome("Ator 2");

            atorRepo.saveAll(List.of(a1, a2));

            // Associando atores aos títulos
            t1.getAtores().add(a1);
            t1.getAtores().add(a2);
            t2.getAtores().add(a2);

            tituloRepo.saveAll(List.of(t1, t2));

            // --- Criando Itens ---
            Item i1 = new Item();
            i1.setNumeroSerie("SN001");
            i1.setTipoItem("DVD");
            i1.setDataAquisicao(LocalDate.now());
            i1.setTitulo(t1);

            Item i2 = new Item();
            i2.setNumeroSerie("SN002");
            i2.setTipoItem("BLURAY");
            i2.setDataAquisicao(LocalDate.now());
            i2.setTitulo(t2);

            itemRepo.saveAll(List.of(i1, i2));

            System.out.println("Database initialized!");
        };
    }
}
*/