package com.inventario.api.service;

import com.inventario.api.model.Producto;
import com.inventario.api.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    public Optional<Producto> findById(Long id) {
        return productoRepository.findById(id);
    }

    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }

    public Optional<Producto> update(Long id, Producto productoData) {
        return productoRepository.findById(id).map(p -> {
            p.setNombre(productoData.getNombre());
            p.setDescripcion(productoData.getDescripcion());
            p.setPrecio(productoData.getPrecio());
            p.setStock(productoData.getStock());
            p.setCategoria(productoData.getCategoria());
            return productoRepository.save(p);
        });
    }

    public boolean delete(Long id) {
        return productoRepository.findById(id).map(p -> {
            productoRepository.delete(p);
            return true;
        }).orElse(false);
    }
}
