package com.example.DevWeb2.controller;

import com.example.DevWeb2.domain.Item;
import com.example.DevWeb2.domain.Titulo;
import com.example.DevWeb2.service.ItemService;
import com.example.DevWeb2.service.TituloService;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/itens")
public class ItemController {

    private final ItemService itemService;
    private final TituloService tituloService;

    public ItemController(ItemService itemService, TituloService tituloService) {
        this.itemService = itemService;
        this.tituloService = tituloService;
    }

    @GetMapping
    public String list(Model model){
        model.addAttribute("itens", itemService.listar());
        model.addAttribute("count", itemService.count());
        return "itens/list";
    }

    @GetMapping("/novo")
    public String createForm(Model model){
        model.addAttribute("item", new Item());
        prepararCombos(model);
        model.addAttribute("title", "Novo Item");
        return "itens/form";
    }

    @GetMapping("/{id}/editar")
    public String edit(@PathVariable Long id, Model model, RedirectAttributes ra){
        return itemService.pesquisar(id)
                .map(i -> { model.addAttribute("item", i); prepararCombos(model); model.addAttribute("title", "Editar Item"); return "itens/form"; })
                .orElseGet(() -> { ra.addFlashAttribute("error", "Item não encontrado"); return "redirect:/itens"; });
    }

    @PostMapping
    public String save(@Valid @ModelAttribute("item") Item item,
                       BindingResult bindingResult,
                       @RequestParam(name = "tituloId", required = false) Long tituloId,
                       RedirectAttributes ra,
                       Model model){
        if (tituloId == null) {
            bindingResult.rejectValue("titulo", "invalid", "Selecione um título");
        } else {
            Titulo titulo = tituloService.pesquisar(tituloId).orElse(null);
            if (titulo == null) {
                bindingResult.rejectValue("titulo", "invalid", "Título inválido");
            } else {
                item.setTitulo(titulo);
            }
        }
        if (bindingResult.hasErrors()){
            prepararCombos(model);
            return "itens/form";
        }
        try {
            itemService.adicionar(item);
            ra.addFlashAttribute("message", "Item salvo com sucesso");
            return "redirect:/itens";
        } catch (IllegalArgumentException e){
            bindingResult.reject(null, e.getMessage());
            prepararCombos(model);
            return "itens/form";
        }
    }

    @PostMapping("/{id}/excluir")
    public String delete(@PathVariable Long id, RedirectAttributes ra){
        try {
            itemService.deletar(id);
            ra.addFlashAttribute("message", "Item removido");
        } catch (IllegalArgumentException | DataIntegrityViolationException e){
            ra.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/itens";
    }

    private void prepararCombos(Model model){
        model.addAttribute("titulos", tituloService.listar());
        model.addAttribute("tipos", new String[]{"FITA", "DVD", "BLURAY"});
    }
}

