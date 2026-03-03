# Redovisning - Webshop-projekt

## Upplägg

### 1. Databas (en person börjar)

Visa upp er databas, gärna med ett ER-diagram: Nils (Sam)

- Vilka tabeller har ni?
- Hur hänger de ihop?
- Vilka relationer finns?

### 2. Demonstration (resten av gruppen)

Varje person väljer en endpoint eller ett helt flöde att visa:

1. Sam: att söka och se produkter från `/products/search?q=%s`, `controllers/productController.js`
2. Nils: att POST:a och PATCH:a produkter som admin via req.body till `/admin/products`, `controllers/adminControllers.js`
3. José: Som kund lägga en order via POST till `/orders`, `controllers/orderControllers.js`
4. Adli: presentera `/categories`, `controllers/categoryControllers.js`, men också `config/db.js` om det finns tid över

**Demonstrera att det fungerar:**

- Ha en förberedd request att skicka (Postman/Thunder Client)
- Eller visa via fungerande frontend
- Visa hur datan presenteras
- Om ni har felhantering - visa gärna en felaktig request också

**Förklara och visa koden:**

- Hur ser requesten ut?
- Vad händer i endpoint-funktionen? (validering? felhantering?)
- Vad händer i databasen?
- Hur ser responsen ut på vägen tillbaka?

**Tips:** Välj endpoints med eftertanke - en enkel "hämta alla produkter" är kanske inte så spännande.

---

## Frågor

Frågor kommer ställas under redovisningen. De är inte till för att sätta dit er, de ska få oss att reflektera.

**Exempel på frågor:**

- Varför valde ni att göra X på det här sättet?
- Varför sköter ni detta i backend istället för i databasen?
- Behövde ni ändra något i databasen i efterhand?
- Vad händer om [något går fel]?
- Hur skulle ni lösa [scenario Y]?

---

## Tips

✓ Alla i gruppen ska prata  
✓ Testa allt innan redovisningen  
✓ Välj intressanta endpoints att visa  
✓ Förklara era val och beslut
