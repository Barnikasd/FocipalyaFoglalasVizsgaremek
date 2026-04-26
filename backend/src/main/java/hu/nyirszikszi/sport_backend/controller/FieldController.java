package hu.nyirszikszi.sport_backend.controller;

import hu.nyirszikszi.sport_backend.model.Field;
import hu.nyirszikszi.sport_backend.repository.FieldRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fields")
@CrossOrigin(origins = "*")
public class FieldController {

    @Autowired
    private FieldRepository fieldRepository;

    @GetMapping
    public List<Field> getAllFields() {
        return fieldRepository.findAll();
    }

    @PostMapping
    public Field createField(@RequestBody Field field) {
        return fieldRepository.save(field);
    }

    @DeleteMapping("/{id}")
    public void deleteField(@PathVariable Long id) {
        fieldRepository.deleteById(id);
    }
}