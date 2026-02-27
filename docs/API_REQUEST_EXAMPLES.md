# API Request Examples

This file contains practical request examples for the current backend API.

## Base URL

Use this base URL while running the server locally:

```bash
http://localhost:3007
```

## Products

### GET all products

```bash
curl -X GET http://localhost:3007/products
```

### GET product by ID

```bash
curl -X GET http://localhost:3007/products/1
```

### GET all products (admin)

```bash
curl -X GET http://localhost:3007/products/admin
```

### GET product by ID (admin)

```bash
curl -X GET http://localhost:3007/products/admin/1
```

### POST create product (admin)

```bash
curl -X POST http://localhost:3007/products/admin \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Blue Hoodie",
    "product_code": "BH-001",
    "listing_price": 49.99,
    "stock_quantity": 25,
    "product_description": "Unisex cotton hoodie"
  }'
```

### POST create product with explicit ID (admin)

```bash
curl -X POST http://localhost:3007/products/admin/100 \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Green Cap",
    "product_code": "GC-100",
    "listing_price": 19.99,
    "stock_quantity": 40,
    "product_description": "Adjustable cap"
  }'
```

### PUT update product (admin, ID in body)

```bash
curl -X PUT http://localhost:3007/products/admin \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "product_name": "Blue Hoodie Updated",
    "product_code": "BH-001",
    "listing_price": 44.99,
    "stock_quantity": 30,
    "product_description": "Updated description"
  }'
```

### PUT update product by ID (admin)

```bash
curl -X PUT http://localhost:3007/products/admin/1 \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Blue Hoodie Updated",
    "product_code": "BH-001",
    "listing_price": 44.99,
    "stock_quantity": 30,
    "product_description": "Updated description"
  }'
```

### PATCH partial update (admin, ID in body)

```bash
curl -X PATCH http://localhost:3007/products/admin \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "listing_price": 39.99,
    "stock_quantity": 20
  }'
```

### PATCH partial update by ID (admin)

```bash
curl -X PATCH http://localhost:3007/products/admin/1 \
  -H "Content-Type: application/json" \
  -d '{
    "listing_price": 39.99,
    "stock_quantity": 20
  }'
```

### DELETE product (admin, ID in body)

```bash
curl -X DELETE http://localhost:3007/products/admin \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1
  }'
```

### DELETE product by ID (admin)

```bash
curl -X DELETE http://localhost:3007/products/admin/1
```

## Orders

### GET orders by customer ID

```bash
curl -X GET http://localhost:3007/orders/customer/1
```

### POST create order for customer

```bash
curl -X POST http://localhost:3007/orders/customer/1 \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address_id": 10,
    "shipping_method_id": 2,
    "total_price": 89.98,
    "order_items": [
      {
        "product_id": 1,
        "product_quantity": 1,
        "item_price": 49.99
      },
      {
        "product_id": 2,
        "product_quantity": 2,
        "item_price": 19.995
      }
    ]
  }'
```

### GET all orders (admin)

```bash
curl -X GET http://localhost:3007/orders/admin
```

### GET order by ID (admin)

```bash
curl -X GET http://localhost:3007/orders/admin/1
```

## Categories

### GET products by category ID

```bash
curl -X GET http://localhost:3007/categories/1/products
```

## Notes

- Current admin middleware is a pass-through placeholder (`adminAuth`), so these admin routes are not blocked yet.
- If you add real auth later, include your token/header in all `/admin` requests.
- Some product admin endpoints use ID in URL and others use ID in request body. Examples above follow current implementation.
