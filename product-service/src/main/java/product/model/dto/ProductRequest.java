package product.model.dto;

import java.math.BigDecimal;

public record ProductRequest(
        String name,
        String skuCode,
        String description,
        BigDecimal price) {
}
