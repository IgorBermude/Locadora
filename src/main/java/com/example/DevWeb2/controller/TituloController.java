package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Titulo;
import com.example.DevWeb2.service.TituloService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/titulos")
public class TituloController {

    private final TituloService service;

    public TituloController(TituloService service) {
        this.service = service;
    }

    @GetMapping
    public String list(Model model){
        model.addAttribute("titulos", service.listar());
        model.addAttribute("count", service.count());
        return "titulos/list";
    }

    @GetMapping("/novo")
    public String createForm(Model model){
        model.addAttribute("titulo", new Titulo());
        model.addAttribute("title", "Novo Título");
        return "titulos/form";
    }

    @PostMapping
    public String save(@Valid @ModelAttribute("titulo") Titulo titulo,
                       BindingResult bindingResult,
                       RedirectAttributes ra){
        if(bindingResult.hasErrors()){
            return "titulos/form";
        }
        service.adicionar(titulo);
        ra.addFlashAttribute("message", "Título salvo com sucesso");
        return "redirect:/titulos";
    }

    @GetMapping("/{id}/editar")
    public String edit(@PathVariable Long id, Model model, RedirectAttributes ra){
        return service.pesquisar(id)
                .map(t -> { model.addAttribute("titulo", t); model.addAttribute("title", "Editar Título"); return "titulos/form"; })
                .orElseGet(() -> { ra.addFlashAttribute("error", "Título não encontrado"); return "redirect:/titulos"; });
    }

    @PostMapping("/{id}/excluir")
    public String delete(@PathVariable Long id, RedirectAttributes ra){
        service.deletar(id);
        ra.addFlashAttribute("message", "Título removido");
        return "redirect:/titulos";
    }
}

