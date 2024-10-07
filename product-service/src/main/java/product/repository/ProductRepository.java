package product.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import product.model.entity.Product;

public interface ProductRepository extends MongoRepository<Product, String> {
}
