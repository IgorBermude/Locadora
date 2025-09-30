package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Diretor;
import com.example.DevWeb2.service.DiretorService;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/diretores")
public class DiretorController {

    private final DiretorService service;

    public DiretorController(DiretorService service) {
        this.service = service;
    }

    @GetMapping
    public String list(Model model) {
        model.addAttribute("diretores", service.listar());
        model.addAttribute("count", service.count());
        return "diretores/list";
    }

    @GetMapping("/novo")
    public String createForm(Model model) {
        model.addAttribute("diretor", new Diretor());
        model.addAttribute("title", "Novo Diretor");
        return "diretores/form";
    }

    @PostMapping
    public String save(@Valid @ModelAttribute("diretor") Diretor diretor,
                       BindingResult bindingResult,
                       RedirectAttributes ra) {
        if (bindingResult.hasErrors()) {
            return "diretores/form";
        }
        try {
            service.adicionar(diretor);
            ra.addFlashAttribute("message", "Diretor salvo com sucesso");
            return "redirect:/diretores";
        } catch (IllegalArgumentException e) {
            bindingResult.rejectValue("nome", "invalid", e.getMessage());
            return "diretores/form";
        }
    }

    @GetMapping("/{id}/editar")
    public String edit(@PathVariable Long id, Model model, RedirectAttributes ra) {
        return service.pesquisar(id)
                .map(d -> { model.addAttribute("diretor", d); model.addAttribute("title", "Editar Diretor"); return "diretores/form"; })
                .orElseGet(() -> { ra.addFlashAttribute("error", "Diretor não encontrado"); return "redirect:/diretores"; });
    }

    @PostMapping("/{id}/excluir")
    public String delete(@PathVariable Long id, RedirectAttributes ra) {
        try {
            service.deletar(id);
            ra.addFlashAttribute("message", "Diretor removido");
        } catch (IllegalArgumentException | DataIntegrityViolationException e) {
            ra.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/diretores";
    }
}
