CREATE DATABASE  IF NOT EXISTS `webshop-db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `webshop-db`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: webshop-db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(45) NOT NULL,
  `category_description` mediumtext,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name_UNIQUE` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Audio','Speakers, headphones, earbuds and accessories.'),(2,'Computers','Keyboards, sleeves, chargers and peripherals.'),(3,'Mobile Accessories','Stands, cables, adapters and phone gear.'),(4,'Home & Living','Lighting, mugs and everyday home items.'),(5,'Fitness','Training accessories for home workouts.'),(6,'Travel','Bags and travel utilities.'),(7,'Stationery','Notebooks, pens and desk supplies.'),(8,'Smart Home','Connected devices and bulbs.'),(9,'Coffee & Kitchen','Coffee and kitchen-related products.'),(10,'Bundles','Discounted product bundles.'),(11,'Premium','High-end product selection.'),(12,'Budget','Affordable everyday products.'),(13,'Gifts','Gift-friendly items.'),(14,'New Arrivals','Recently added products.'),(15,'Best Sellers','Popular items.'),(16,'Office Setup','Desk and work-from-home essentials.'),(17,'Gaming','Gaming-focused gear.'),(18,'Sustainability','Eco-focused products.'),(19,'Portable Tech','Easy-to-carry electronics.'),(20,'Cables & Charging','Charging bricks and cables.');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_addresses`
--

DROP TABLE IF EXISTS `customer_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_addresses` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `address` varchar(45) DEFAULT NULL,
  `postal_code` varchar(15) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `state_or_province` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `address_type` enum('shipping','billing','residence') NOT NULL,
  `care_of` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  KEY `fk_adresses_customer_idx` (`customer_id`),
  CONSTRAINT `fk_addresses_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_addresses`
--

LOCK TABLES `customer_addresses` WRITE;
/*!40000 ALTER TABLE `customer_addresses` DISABLE KEYS */;
INSERT INTO `customer_addresses` VALUES (1,1,'Storgatan 12','11451','Sweden','Stockholm County','Stockholm','shipping','c/o Nyberg'),(2,2,'Södra Vägen 7','41254','Sweden','Västra Götaland','Göteborg','shipping',NULL),(3,3,'Kungsportsavenyen 33','41136','Sweden','Västra Götaland','Göteborg','shipping','c/o Söder'),(4,4,'Drottninggatan 5','11151','Sweden','Stockholm County','Stockholm','shipping',NULL),(5,5,'Malmövägen 18','21422','Sweden','Skåne','Malmö','shipping',NULL),(6,6,'Lilla Torg 2','21134','Sweden','Skåne','Malmö','shipping','c/o Ek'),(7,7,'Uppsala Gata 9','75320','Sweden','Uppsala County','Uppsala','shipping',NULL),(8,8,'Vasagatan 44','90326','Sweden','Västerbotten','Umeå','shipping',NULL),(9,9,'Östra Hamngatan 1','41110','Sweden','Västra Götaland','Göteborg','shipping','c/o Sand'),(10,10,'Stora Nygatan 21','21137','Sweden','Skåne','Malmö','shipping',NULL),(11,11,'Sveavägen 100','11350','Sweden','Stockholm County','Stockholm','shipping',NULL),(12,12,'Järnvägsgatan 6','35230','Sweden','Kronoberg','Växjö','shipping','c/o Hed'),(13,13,'S:t Larsgatan 3','58224','Sweden','Östergötland','Linköping','shipping',NULL),(14,14,'Kungsgatan 11','70211','Sweden','Örebro County','Örebro','shipping',NULL),(15,15,'Storgatan 66','97232','Sweden','Norrbotten','Luleå','shipping','c/o Falk'),(16,16,'Åsgatan 4','83130','Sweden','Jämtland','Östersund','shipping',NULL),(17,17,'Ringvägen 55','11861','Sweden','Stockholm County','Stockholm','shipping',NULL),(18,18,'Nygatan 8','60234','Sweden','Östergötland','Norrköping','shipping','c/o Öst'),(19,19,'Brogatan 19','30242','Sweden','Halland','Halmstad','shipping',NULL),(20,20,'Parkvägen 2','90736','Sweden','Västerbotten','Umeå','shipping',NULL);
/*!40000 ALTER TABLE `customer_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_passwords`
--

DROP TABLE IF EXISTS `customer_passwords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_passwords` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `password_hash` varchar(255) DEFAULT NULL,
  `password_updated_at` datetime NOT NULL,
  PRIMARY KEY (`customer_id`),
  CONSTRAINT `fk_passwords_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_passwords`
--

LOCK TABLES `customer_passwords` WRITE;
/*!40000 ALTER TABLE `customer_passwords` DISABLE KEYS */;
INSERT INTO `customer_passwords` VALUES (1,'$2y$10$A1iceHashExample0000000000000000000000000000000000000','2025-01-04 10:12:00'),(2,'$2y$10$0scarHashExample0000000000000000000000000000000000000','2025-01-06 09:41:00'),(3,'$2y$10$EmmaHashExample00000000000000000000000000000000000000','2025-01-09 15:20:00'),(4,'$2y$10$LiamHashExample00000000000000000000000000000000000000','2025-01-12 13:05:00'),(5,'$2y$10$MiaaHashExample00000000000000000000000000000000000000','2025-01-15 18:11:00'),(6,'$2y$10$NoahHashExample00000000000000000000000000000000000000','2025-01-18 08:55:00'),(7,'$2y$10$EllaHashExample00000000000000000000000000000000000000','2025-01-22 12:33:00'),(8,'$2y$10$OlivHashExample00000000000000000000000000000000000000','2025-01-25 17:45:00'),(9,'$2y$10$AvaaHashExample00000000000000000000000000000000000000','2025-02-01 11:02:00'),(10,'$2y$10$EliaHashExample00000000000000000000000000000000000000','2025-02-04 09:10:00'),(11,'$2y$10$SignHashExample00000000000000000000000000000000000000','2025-02-08 16:28:00'),(12,'$2y$10$WillHashExample00000000000000000000000000000000000000','2025-02-12 14:03:00'),(13,'$2y$10$FreyHashExample00000000000000000000000000000000000000','2025-02-17 19:22:00'),(14,'$2y$10$ArthHashExample00000000000000000000000000000000000000','2025-02-21 10:49:00'),(15,'$2y$10$LillHashExample00000000000000000000000000000000000000','2025-02-25 13:36:00'),(16,'$2y$10$HugoHashExample00000000000000000000000000000000000000','2025-03-01 08:07:00'),(17,'$2y$10$IsabHashExample00000000000000000000000000000000000000','2025-03-05 20:14:00'),(18,'$2y$10$LeooHashExample00000000000000000000000000000000000000','2025-03-09 12:58:00'),(19,'$2y$10$NoraHashExample00000000000000000000000000000000000000','2025-03-13 09:26:00'),(20,'$2y$10$AdamHashExample00000000000000000000000000000000000000','2025-03-18 15:40:00');
/*!40000 ALTER TABLE `customer_passwords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `created` datetime(5) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'alice.nyberg@example.com','Alice','Nyberg','2025-01-04 10:12:00.00000'),(2,'oscar.lind@example.com','Oscar','Lind','2025-01-06 09:41:00.00000'),(3,'emma.soder@example.com','Emma','Söder','2025-01-09 15:20:00.00000'),(4,'liam.berg@example.com','Liam','Berg','2025-01-12 13:05:00.00000'),(5,'mia.holm@example.com','Mia','Holm','2025-01-15 18:11:00.00000'),(6,'noah.ek@example.com','Noah','Ek','2025-01-18 08:55:00.00000'),(7,'ella.strom@example.com','Ella','Ström','2025-01-22 12:33:00.00000'),(8,'oliver.dahl@example.com','Oliver','Dahl','2025-01-25 17:45:00.00000'),(9,'ava.sand@example.com','Ava','Sand','2025-02-01 11:02:00.00000'),(10,'elias.karlsson@example.com','Elias','Karlsson','2025-02-04 09:10:00.00000'),(11,'signe.ahl@example.com','Signe','Ahl','2025-02-08 16:28:00.00000'),(12,'william.hed@example.com','William','Hed','2025-02-12 14:03:00.00000'),(13,'freya.noren@example.com','Freya','Norén','2025-02-17 19:22:00.00000'),(14,'arthur.bjork@example.com','Arthur','Björk','2025-02-21 10:49:00.00000'),(15,'lilly.falk@example.com','Lilly','Falk','2025-02-25 13:36:00.00000'),(16,'hugo.ryd@example.com','Hugo','Ryd','2025-03-01 08:07:00.00000'),(17,'isabella.west@example.com','Isabella','West','2025-03-05 20:14:00.00000'),(18,'leo.ost@example.com','Leo','Öst','2025-03-09 12:58:00.00000'),(19,'nora.blom@example.com','Nora','Blom','2025-03-13 09:26:00.00000'),(20,'adam.skog@example.com','Adam','Skog','2025-03-18 15:40:00.00000');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_quantity` int NOT NULL,
  `item_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`,`order_id`),
  KEY `fk_product_idx` (`product_id`),
  KEY `fk_order_idx` (`order_id`),
  CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `fk_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,199.00),(2,1,7,1,129.00),(3,1,10,1,99.00),(4,2,4,1,1299.00),(5,3,3,1,249.00),(6,4,16,1,699.00),(7,5,2,1,799.00),(8,5,18,1,599.00),(9,6,11,1,299.00),(10,7,12,1,179.00),(11,8,2,1,799.00),(12,9,6,1,349.00),(13,9,17,1,129.00),(14,10,9,1,399.00),(15,11,7,1,129.00),(16,11,10,1,99.00),(17,12,20,1,1999.00),(18,13,1,1,199.00),(19,13,15,1,349.00),(20,14,10,1,99.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `shipping_address_id` int NOT NULL,
  `shipping_method_id` int NOT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `order_status` enum('created','paid','shipped','delivered','cancelled') NOT NULL,
  PRIMARY KEY (`order_id`,`customer_id`),
  KEY `fk_orders_customer_idx` (`customer_id`),
  KEY `fk_shipping_address_idx` (`shipping_address_id`),
  KEY `fk_shipping_method_idx` (`shipping_method_id`),
  CONSTRAINT `fk_orders_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`),
  CONSTRAINT `fk_shipping_address_id` FOREIGN KEY (`shipping_address_id`) REFERENCES `customer_addresses` (`address_id`),
  CONSTRAINT `fk_shipping_method_id` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_methods` (`shipping_methods_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,1,2,448.00,'2025-04-01 10:05:00','paid'),(2,2,2,4,1299.00,'2025-04-02 12:17:00','shipped'),(3,3,3,9,248.00,'2025-04-03 09:44:00','delivered'),(4,4,4,1,699.00,'2025-04-04 18:22:00','paid'),(5,5,5,7,1098.00,'2025-04-05 14:09:00','created'),(6,6,6,8,299.00,'2025-04-06 08:31:00','paid'),(7,7,7,10,179.00,'2025-04-07 16:10:00','delivered'),(8,8,8,3,799.00,'2025-04-08 11:55:00','shipped'),(9,9,9,6,328.00,'2025-04-09 19:05:00','paid'),(10,10,10,5,399.00,'2025-04-10 13:47:00','paid'),(11,11,11,12,229.00,'2025-04-11 10:20:00','created'),(12,12,12,11,1999.00,'2025-04-12 09:08:00','paid'),(13,13,13,14,579.00,'2025-04-13 20:11:00','paid'),(14,14,14,15,99.00,'2025-04-14 15:16:00','delivered'),(15,15,15,16,599.00,'2025-04-15 17:42:00','shipped'),(16,16,16,13,498.00,'2025-04-16 12:02:00','paid'),(17,17,17,18,349.00,'2025-04-17 08:59:00','paid'),(18,18,18,19,249.00,'2025-04-18 21:30:00','cancelled'),(19,19,19,20,129.00,'2025-04-19 14:25:00','paid'),(20,20,20,17,2078.00,'2025-04-20 10:40:00','shipped');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `billing_address_id` int NOT NULL,
  `order_id` int NOT NULL,
  `payment_method` enum('card','swish','paypal','bank_transfer') NOT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `payment_status` enum('paid','refunded','pending') DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `fk_billing_address_idx` (`billing_address_id`),
  KEY `fk_payments_order_idx` (`order_id`),
  CONSTRAINT `fk_billing_address_id` FOREIGN KEY (`billing_address_id`) REFERENCES `customer_addresses` (`address_id`),
  CONSTRAINT `fk_payments_order_id` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,1,'card',448.00,'paid'),(2,2,2,'card',1299.00,'paid'),(3,3,3,'swish',248.00,'paid'),(4,4,4,'paypal',699.00,'paid'),(5,5,5,'card',0.00,'pending'),(6,6,6,'swish',299.00,'paid'),(7,7,7,'card',179.00,'paid'),(8,8,8,'card',799.00,'paid'),(9,9,9,'swish',328.00,'paid'),(10,10,10,'card',399.00,'paid'),(11,11,11,'card',0.00,'pending'),(12,12,12,'bank_transfer',1999.00,'paid'),(13,13,13,'card',579.00,'paid'),(14,14,14,'swish',99.00,'paid'),(15,15,15,'card',599.00,'paid'),(16,16,16,'paypal',498.00,'paid'),(17,17,17,'card',349.00,'paid'),(18,18,18,'card',0.00,'refunded'),(19,19,19,'swish',129.00,'paid'),(20,20,20,'card',2078.00,'paid');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `product_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `fk_products_category_idx` (`category_id`),
  KEY `fk_categories_product_idx` (`product_id`),
  CONSTRAINT `fk_categories_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `fk_products_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES (2,1),(16,1),(20,1),(3,2),(4,2),(6,2),(17,3),(19,3),(10,4),(15,4),(11,5),(12,5),(18,6),(19,6),(13,7),(14,7),(8,8),(9,9),(6,20),(7,20);
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tags`
--

DROP TABLE IF EXISTS `product_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tags` (
  `tag_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`tag_id`,`product_id`),
  KEY `fk_tags_product_idx` (`product_id`),
  KEY `fk_products_tag_idx` (`tag_id`),
  CONSTRAINT `fk_products_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`),
  CONSTRAINT `fk_tags_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tags`
--

LOCK TABLES `product_tags` WRITE;
/*!40000 ALTER TABLE `product_tags` DISABLE KEYS */;
INSERT INTO `product_tags` VALUES (1,1),(3,1),(6,2),(15,2),(2,4),(8,4),(2,7),(10,8),(5,10),(7,11),(7,12),(8,13),(8,15),(6,16),(13,16),(15,16),(9,18),(9,19),(6,20),(11,20);
/*!40000 ALTER TABLE `product_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(45) DEFAULT NULL,
  `product_code` varchar(45) DEFAULT NULL,
  `listing_price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL,
  `product_description` mediumtext,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_code_UNIQUE` (`product_code`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Stainless Water Bottle 750ml','WB-750-SS',199.00,120,'Double-wall bottle, keeps drinks cold/hot.'),(2,'Wireless Earbuds','AUDIO-BUDS-01',799.00,55,'Compact earbuds with charging case.'),(3,'Laptop Sleeve 13-inch','SLEEVE-13-GRY',249.00,200,'Padded sleeve for 13-inch laptops.'),(4,'Mechanical Keyboard','KB-MECH-87',1299.00,40,'87-key mechanical keyboard with backlight.'),(5,'Gaming Mouse','MOUSE-GAME-02',499.00,75,'Ergonomic mouse with adjustable DPI.'),(6,'USB-C Charger 65W','CHG-USBC-65',349.00,180,'Fast charger with USB-C PD.'),(7,'USB-C Cable 2m','CABLE-USBC-2M',129.00,300,'Durable braided USB-C cable.'),(8,'Smart LED Bulb','LED-SMART-A19',149.00,260,'App-controlled dimmable LED bulb.'),(9,'Coffee Grinder Manual','COF-GRIND-M1',399.00,65,'Manual burr grinder for fresh coffee.'),(10,'Ceramic Mug 350ml','MUG-CER-350',99.00,500,'Classic ceramic mug, dishwasher safe.'),(11,'Yoga Mat','FIT-YOGA-06',299.00,90,'Non-slip yoga mat with carry strap.'),(12,'Resistance Bands Set','FIT-BAND-SET',179.00,130,'5-band set with different resistance levels.'),(13,'Notebook A5 Dotted','NOTE-A5-DOT',79.00,400,'Dotted notebook for notes and sketches.'),(14,'Ballpoint Pen Pack (10)','PEN-BP-10',59.00,600,'Smooth-writing ballpoint pens.'),(15,'Desk Lamp LED','HOME-LAMP-LED',349.00,70,'Adjustable LED desk lamp with touch control.'),(16,'Bluetooth Speaker','AUDIO-SPK-05',699.00,48,'Portable speaker with deep bass.'),(17,'Phone Stand Aluminum','STAND-PHONE-AL',129.00,220,'Adjustable phone stand for desk.'),(18,'Backpack 20L','BAG-20L-BLK',599.00,35,'Daily backpack with laptop compartment.'),(19,'Travel Adapter EU/US/UK','TRAV-ADAPT-01',249.00,110,'Universal travel adapter with USB ports.'),(20,'Noise Cancelling Headphones','AUDIO-NC-10',1999.00,22,'Over-ear ANC headphones for travel.');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipping_methods`
--

DROP TABLE IF EXISTS `shipping_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipping_methods` (
  `shipping_methods_id` int NOT NULL AUTO_INCREMENT,
  `method_name` varchar(45) NOT NULL,
  PRIMARY KEY (`shipping_methods_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipping_methods`
--

LOCK TABLES `shipping_methods` WRITE;
/*!40000 ALTER TABLE `shipping_methods` DISABLE KEYS */;
INSERT INTO `shipping_methods` VALUES (1,'PostNord Home Delivery'),(2,'PostNord Pickup Point'),(3,'DHL Express'),(4,'DHL ServicePoint'),(5,'Bring Home'),(6,'Bring Pickup'),(7,'Budbee Home'),(8,'Budbee Box'),(9,'Instabox Locker'),(10,'Schenker Ombud'),(11,'Schenker Home'),(12,'UPS Standard'),(13,'UPS Express'),(14,'FedEx International Priority'),(15,'Early Bird Delivery'),(16,'Same-day Courier'),(17,'Economy Letter'),(18,'Climate Smart Shipping'),(19,'Gift Wrapped Shipping'),(20,'Store Pickup');
/*!40000 ALTER TABLE `shipping_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `tag_type_id` int NOT NULL,
  `tag_content` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,1,'new'),(2,1,'bestseller'),(3,1,'eco'),(4,1,'limited'),(5,1,'gift'),(6,2,'audio'),(7,2,'fitness'),(8,2,'office'),(9,2,'travel'),(10,2,'smart-home'),(11,3,'premium'),(12,3,'budget'),(13,3,'portable'),(14,3,'wired'),(15,3,'wireless'),(16,4,'stock-low'),(17,4,'stock-high'),(18,4,'bundle'),(19,5,'summer'),(20,5,'winter');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-19 16:56:53
