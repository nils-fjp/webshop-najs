# webshop-najs

Webbshop-backend med frontend, byggt som grupprojekt i kursen Databaser vid Teknikhögskolan.

REST-API i Express 5 kopplat till en MySQL-databas, med en frontend som har en shop-vy för kunder och en admin-vy för testning/debugging.

**Gruppmedlemmar:** Nils, Adli, Jose, Sam

---

## Kom igång

### Förutsättningar

- Node.js
- MySQL

### Installation

1. Klona repot:

```bash
git clone https://github.com/nils-fjp/webshop-najs.git
cd webshop-najs
```

2. Installera beroenden:

```bash
npm install
```

3. Skapa en `.env`-fil i rotkatalogen:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ditt_lösenord
DB_NAME=najs-db
PORT=3007
```

4. Skapa databasen och seed-datan genom att köra SQL-skriptet:

```bash
mysql -u root -p < generate-najs-db.sql
```

5. Starta servern:

```bash
npm run dev    # med nodemon (auto-restart vid filändringar)
npm start      # utan nodemon
```

6. Öppna `public/test.html` direkt i webbläsaren (frontend servas inte av Express-servern).

---

## Projektstruktur

```
webshop-najs/
├── index.js                    # Express-server: middleware, route-montering
├── generate-najs-db.sql        # Databasschema + testdata (20 rader per tabell)
├── .env                        # Miljövariabler (skapas manuellt, versionshanteras ej)
│
├── config/
│   └── db.js                   # MySQL connection pool (mysql2/promise + dotenv)
│
├── controllers/                # Affärslogik och SQL-frågor per resurs
│   ├── productController.js    # Hämta produkter, sökning
│   ├── adminController.js      # CRUD produkter, visa ordrar (admin)
│   ├── orderController.js      # Skapa order (transaction), orderhistorik
│   ├── categoryController.js   # Kategorier, produkter per kategori
│   ├── loginController.js      # Inloggning via e-post
│   ├── addressController.js    # Kundens adresser
│   └── shippingController.js   # Fraktmetoder
│
├── routes/                     # Routedefinitioner, kopplar URL:er till controllers
│   ├── productRoutes.js        # /products
│   ├── adminRoutes.js          # /admin
│   ├── orderRoutes.js          # /orders
│   ├── categoryRoutes.js       # /categories
│   ├── loginRoutes.js          # /login
│   ├── addressRoutes.js        # /customers
│   └── shippingRoutes.js       # /shipping-methods
│
├── public/                     # Frontend (öppnas direkt i webbläsaren)
│   ├── test.html               # Huvudsida: shop-vy + admin-vy med toggle-knapp
│   ├── index.html              # Fristående admin/debug-verktyg
│   ├── style.css               # Dark theme (CSS custom properties)
│   └── js/
│       ├── config.js           # Globala inställningar (API-URL, localStorage-nycklar)
│       ├── product-card.js     # Kategorier, produktsökning, lägg-till-i-varukorg
│       ├── cart.js             # Varukorg, ta bort varor, checkout
│       ├── login.js            # Inloggning/utloggning, adresser, fraktmetoder
│       └── admin.js            # Admin-vyns formulär (GET/POST mot valfri endpoint)
│
├── docs/                       # Kursdokumentation
│   ├── inlamningsuppgift.md    # User stories / kurskriterier
│   ├── redovisningsinstruktioner.md
│   └── 2026-03-04-curl-db.txt  # curl-exempel för alla endpoints
│
└── legacy/                     # Äldre prototyper och anteckningar
```

---

## Databas

Databasen genereras av `generate-najs-db.sql` som skapar databasen `najs-db`, 12 tabeller, och fyller varje tabell med 20 rader testdata.

### Tabeller

**Kunder:**

| Tabell               | Beskrivning                                                |
| -------------------- | ---------------------------------------------------------- |
| `customers`          | Kundkonton (username, email, namn)                         |
| `customer_passwords` | Lösenords-hashar, separat från kundtabellen                |
| `customer_addresses` | Adresser kopplade till kunder (shipping/billing/residence) |

**Produkter:**

| Tabell               | Beskrivning                                                    |
| -------------------- | -------------------------------------------------------------- |
| `products`           | Produkter (namn, kod, pris, lagersaldo, beskrivning)           |
| `categories`         | Produktkategorier                                              |
| `product_categories` | Kopplingstabell: produkter <-> kategorier (many-to-many)       |
| `tags`               | Taggar med typ (label, use-case, tier, stock-status, seasonal) |
| `product_tags`       | Kopplingstabell: produkter <-> taggar (many-to-many)           |

**Ordrar:**

| Tabell        | Beskrivning                                          |
| ------------- | ---------------------------------------------------- |
| `orders`      | Ordrar (kund, adress, fraktmetod, totalpris, status) |
| `order_items` | Orderrader (produkt, antal, styckpris)               |
| `payments`    | Betalningar kopplade till ordrar                     |

**Frakt:**

| Tabell             | Beskrivning                                            |
| ------------------ | ------------------------------------------------------ |
| `shipping_methods` | Tillgängliga fraktmetoder (PostNord, DHL, Bring, etc.) |

### Relationer

```
customers 1───* customer_addresses
customers 1───1 customer_passwords
customers 1───* orders

orders    1───* order_items
orders    *───1 customer_addresses (leveransadress)
orders    *───1 shipping_methods

order_items *───1 products

payments  *───1 orders
payments  *───1 customer_addresses (faktureringsadress)

products  *───* categories    (via product_categories)
products  *───* tags          (via product_tags)
```

### Designval

- **Separat lösenordstabell** (`customer_passwords`): lösenords-hashar lagras skilt från kunddata.
- **Kopplingstabeller** för many-to-many: produkter kan tillhöra flera kategorier och ha flera taggar.
- **ENUM-typer** för orderstatus (`created`, `paid`, `shipped`, `delivered`, `cancelled`) och betalningsmetod (`card`, `swish`, `paypal`, `bank_transfer`).
- **Adresstyp** styrs av ENUM (`shipping`, `billing`, `residence`) för att skilja på leverans- och faktureringsadresser.

---

## Backend

### Server (`index.js`)

Servern använder Express 5 med följande middleware:

- **CORS** (`cors`) -- tillåter anrop från alla ursprung
- **JSON-parsing** (`express.json()`) -- parsar JSON-request bodies

7 routegrupper monteras på sina respektive bassökvägar. Porten konfigureras via `.env` (default 3007).

### Databasanslutning (`config/db.js`)

- Använder `mysql2/promise` med en **connection pool** (max 10 samtidiga anslutningar)
- Databasuppgifter laddas från `.env` via `dotenv`
- Testar anslutningen vid uppstart och avslutar processen om den misslyckas

### Routes och Controllers

Projektet följer ett MVC-liknande mönster:

- **Routes** (`routes/`) definierar vilka endpoints som finns och vilken HTTP-metod de använder, och delegerar till rätt controller-funktion.
- **Controllers** (`controllers/`) innehåller all affärslogik: validering, SQL-frågor mot databasen, och formatering av svar.
- **Model-lagret** är databasen själv -- controllers pratar direkt med MySQL via connection-poolen från `config/db.js`.

Denna uppdelning gör att varje fil har ett tydligt ansvar och att endpoints för samma resurs samlas på ett ställe.

### API-referens

#### Kundendpoints

| Metod  | sökväg                              | Beskrivning                          |
| ------ | ----------------------------------- | ------------------------------------ |
| `GET`  | `/products`                         | Alla produkter (stödjer `?search=`)  |
| `GET`  | `/products/:product_id`             | En enskild produkt                   |
| `GET`  | `/categories`                       | Alla kategorier (stödjer `?search=`) |
| `GET`  | `/categories/:category_name`        | Produkter i en kategori              |
| `POST` | `/orders`                           | Skapa en order (med transaction)     |
| `GET`  | `/orders/:customer_id`              | En kunds orderhistorik               |
| `POST` | `/login`                            | Logga in med e-post                  |
| `GET`  | `/customers/:customer_id/addresses` | Kundens adresser                     |
| `GET`  | `/shipping-methods`                 | Alla fraktmetoder                    |

#### Admin-endpoints

| Metod                   | sökväg                        | Beskrivning                          |
| ----------------------- | ----------------------------- | ------------------------------------ |
| `GET`                   | `/admin/products`             | Alla produkter                       |
| `GET`                   | `/admin/products/:product_id` | En produkt                           |
| `POST`                  | `/admin/products`             | Skapa ny produkt                     |
| `PATCH`                 | `/admin/products`             | Delvis uppdatering av produkt        |
| `PUT`                   | `/admin/products`             | Full uppdatering av produkt          |
| `DELETE`                | `/admin/products`             | Ta bort produkt                      |
| `POST/PATCH/PUT/DELETE` | `/admin/products/:product_id` | Samma operationer via route params   |
| `GET`                   | `/admin/orders`               | Alla ordrar (med fullständiga JOINs) |
| `GET`                   | `/admin/orders/:order_id`     | En enskild order                     |

Admin-endpoints stödjer både `product_id` i request body och som route parameter -- båda varianter finns implementerade.

Se `docs/2026-03-04-curl-db.txt` för curl-exempel på alla endpoints.

### Viktiga backend-funktioner

**Transaktionsbaserad orderskapning:** `createOrder` i `orderController.js` använder `beginTransaction`, `commit` och `rollback` för att säkerställa att hela orderprocessen är atomisk. Funktionen:

1. Validerar kund och leveransadress
2. Filtrerar bort orderrader med `product_quantity: 0`
3. Kontrollerar lagersaldo för varje produkt
4. Beräknar styckpris och totalpris
5. Skapar ordern och alla orderrader
6. Minskar lagersaldot för varje beställd produkt

Om något steg misslyckas rullas hela transaktionen tillbaka.

**Dynamisk PATCH:** Admin PATCH-endpointen bygger sin SQL `SET`-klausul dynamiskt utifrån vilka fält som skickas i request body. Det går att uppdatera ett enstaka fält utan att behöva skicka alla.

---

## Frontend

Frontenden ligger i `public/` och öppnas direkt som filer i webbläsaren (den servas inte av Express-servern).

### Huvudsida (`test.html`)

Huvudsidan har en **delad header** som alltid är synlig, med en toggle-knapp som växlar mellan två vyer:

**Shop-vy** (standardvy):

- 3-kolumnslayout med CSS Grid
- **Vanster:** Kategorisidofält -- klicka på en kategori för att filtrera produkter
- **Mitten:** Produktrutnät med sökfält och sök-/rensa-knappar
- **Hoger:** Varukorg med adress- och fraktval, summering, och checkout-knapp

**Admin-vy** (debug/testverktyg):

- Formulär för att skicka GET-anrop mot valfri endpoint och visa resultatet i en tabell
- Formulär för att skapa ordrar med POST (customer_id, adress, fraktmetod, )

### JavaScript-arkitektur

Frontenden är uppdelad i 5 JavaScript-filer som laddas i ordning:

1. **`config.js`** -- globala inställningar (`API_URL`, `localStorage`-nycklar) på `window.APP`
2. **`product-card.js`** -- laddar kategorier, hanterar sökning, renderar produktkort, lägg-till-i-varukorg (IIFE)
3. **`cart.js`** -- renderar varukorgen, tar bort varor, checkout-logik, exponerar `renderCart` på `window.APP` (IIFE)
4. **`login.js`** -- inloggning/utloggning via e-post, laddar adresser och fraktmetoder (IIFE)
5. **`admin.js`** -- kopplar admin-vyns GET/POST/search-formulär

Modulerna är self-contained IIFEs och kommunicerar via `window.APP`-objektet. Varukorgen sparas i `localStorage` och behövs därför ingen inloggning.

### Styling

`style.css` använder CSS custom properties för ett mörkt tema med glasmorfism-effekter i headern. Layouten är responsiv med breakpoints vid 1100px och 820px.

---

## Uppfyllda kurskriterier

Baserat på user stories i `docs/inlamningsuppgift.md`.

### Obligatoriska (alla uppfyllda)

**Kundperspektiv:**

- Se alla produkter och produktdetaljer
- Slutfora köp / lägga order
- Se orderhistorik
- Filtrera produkter efter kategori
- Söka efter produkter

**Adminperspektiv:**

- lägga till, uppdatera och ta bort produkter (fullständig CRUD)
- Se alla ordrar

### Utökade funktioner

**Kundperspektiv:**

- Varukorg: lägga till produkter, se totalpris, uppdatera antal, ta bort produkter
- Inloggning
- Se lagerstatus på produkter
- Se orderdetaljer (produkter, antal, pris per vara)

**Adminperspektiv:**

- Se lagersaldo
- Uppdatera lagersaldo

### Tekniska tillägg

- Automatisk lagerminskning vid köp
- Blockera köp av produkter som är slutsålda
- Environment variables för känslig data (`.env`)
