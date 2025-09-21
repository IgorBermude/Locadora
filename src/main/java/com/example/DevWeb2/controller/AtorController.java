package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Ator;
import com.example.DevWeb2.service.AtorService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/atores")
public class AtorController {

    private final AtorService service;

    public AtorController(AtorService service) {
        this.service = service;
    }

    @GetMapping
    public String list(Model model){
        model.addAttribute("atores", service.listar());
        model.addAttribute("count", service.count());
        return "atores/list";
    }

    @GetMapping("/novo")
    public String createForm(Model model){
        model.addAttribute("ator", new Ator());
        model.addAttribute("title", "Novo Ator");
        return "atores/form";
    }

    @PostMapping
    public String save(@Valid @ModelAttribute("ator") Ator ator,
                       BindingResult bindingResult,
                       RedirectAttributes redirectAttributes){
        if (bindingResult.hasErrors()) {
            return "atores/form";
        }
        service.adicionar(ator);
        redirectAttributes.addFlashAttribute("message", "Ator salvo com sucesso");
        return "redirect:/atores";
    }

    @GetMapping("/{id}/editar")
    public String edit(@PathVariable Long id, Model model, RedirectAttributes ra){
        return service.pesquisar(id)
                .map(a -> {
                    model.addAttribute("ator", a);
                    model.addAttribute("title", "Editar Ator");
                    return "atores/form";
                })
                .orElseGet(() -> {
                    ra.addFlashAttribute("error", "Ator não encontrado");
                    return "redirect:/atores";
                });
    }

    @PostMapping("/{id}/excluir")
    public String delete(@PathVariable Long id, RedirectAttributes ra){
        service.deletar(id);
        ra.addFlashAttribute("message", "Ator removido");
        return "redirect:/atores";
    }
}
