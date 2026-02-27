# User Stories - Webshop-projekt

## Obligatoriska (Grundläggande funktionalitet)

### Kund-perspektiv

- [x] Som kund vill jag kunna se alla tillgängliga produkter så att jag kan bläddra i sortimentet
- [x] Som kund vill jag kunna se detaljerad information om en enskild produkt så att jag kan fatta köpbeslut

- Som kund vill jag kunna slutföra ett köp/lägga en order så att jag kan genomföra mina inköp
- [x] Som kund vill jag kunna se mina tidigare ordrar så att jag har koll på min köphistorik
- [x] Som kund vill jag kunna filtrera produkter efter kategori så att jag hittar vad jag söker snabbare
- Som kund vill jag kunna söka efter produkter så att jag snabbt kan hitta specifika varor

### Admin-perspektiv

- [x] Som admin vill jag kunna lägga till nya produkter så att sortimentet kan växa
- [x] Som admin vill jag kunna uppdatera produktinformation så att informationen hålls aktuell
- [x] Som admin vill jag kunna ta bort produkter så att utgående produkter kan rensas bort
- [x] Som admin vill jag kunna se alla ordrar så att jag kan hantera verksamheten

## Utökade funktioner (Välj minst 3-4)

### Kund-perspektiv

- Som kund vill jag kunna lägga till produkter i en varukorg så att jag kan samla mina val innan köp
- Som kund vill jag kunna se min varukorg med totalpris så att jag vet vad jag ska betala
- Som kund vill jag kunna registrera ett konto så att mina uppgifter sparas
- Som kund vill jag kunna logga in så att jag kan komma åt mina uppgifter
- Som kund vill jag kunna sortera produkter (pris, namn, popularitet) så att jag kan hitta bästa erbjudandet
- Som kund vill jag kunna se om en produkt finns i lager så att jag vet om jag kan köpa den
- Som kund vill jag kunna uppdatera antal i varukorgen så att jag kan ändra min beställning
- Som kund vill jag kunna ta bort produkter från varukorgen så att jag kan ångra mig
- Som kund vill jag kunna se orderdetaljer (vilka produkter, antal, pris per vara) så att jag kan granska mitt köp
- Som kund vill jag kunna lägga produkter i en önskelista så att jag kan spara intressanta produkter till senare
- Som kund vill jag kunna betygsätta produkter så att jag kan dela min åsikt
- Som kund vill jag kunna se produktbetyg så att jag kan läsa andras åsikter

### Admin-perspektiv

- Som admin vill jag kunna se hur många produkter som finns i lager så att jag kan planera inköp
- Som admin vill jag kunna uppdatera lagersaldo så att informationen är korrekt
- Som admin vill jag kunna se försäljningsstatistik så att jag förstår verksamheten
- Som admin vill jag kunna se vilka produkter som säljer bäst så att jag kan optimera sortimentet
- Som admin vill jag kunna se totala intäkter per tidsperiod så att jag kan följa omsättning
- Som admin vill jag kunna ändra orderstatus (packad, skickad, levererad) så att kunder kan följa sina ordrar
- Som admin vill jag kunna skapa produktkategorier så att produkter kan organiseras
- Som admin vill jag kunna tilldela produkter till kategorier så att strukturen blir logisk
- Som admin vill jag kunna se vilka kunder som handlat mest så att jag kan identifiera stamkunder
- Som admin vill jag kunna skapa rabattkoder så att jag kan köra kampanjer
- Som admin vill jag kunna se låglagervarninga så att jag kan beställa i tid

## Tekniska utmaningar & tillägg (Frivilligt urval)

### Data & Import/Export

- Importera produktdata från en CSV/JSON-fil till databasen
- Exportera orderhistorik till CSV-fil

### Externa integrationer

- Integrera med ett externt API för produktbilder (Unsplash, Pexels, Pixabay)
- Integrera med ett currency/valuta-API för priser i olika valutor
- Integrera med ett email-API för att skicka orderbekräftelser

### Avancerad sökning & filtrering

- Implementera sökning med flera kriterier samtidigt
- Prisintervall-filtrering (min-max slider/input)
- Fuzzy search (matchning även vid felstavning)
- Auto-complete i sökfältet
- Pagination (visa X produkter per sida)

### Affärslogik & Automatisering

- Automatisk lagerminskning vid köp
- Blockera köp av produkter som är slutsålda
- Beräkna och visa fraktkostnad baserat på ordervärde
- Automatiska rekommendationer ("andra köpte också...")
- Implementera rabattkoder som kan appliceras vid checkout
- Olika rabatttyper (procent, fast belopp, fri frakt)
- Produktvarianter (storlek, färg) med olika priser/lager
- Bundle-erbjudanden (köp X få Y rabatt)

### Användarupplevelse

- Spara varukorg mellan sessioner (även utan inloggning)
- Real-time uppdatering av lager-status i frontend
- Ladda upp produktbilder
- Generera QR-koder för ordrar
- Skapa PDF-kvitton/fakturor
- Visa "senast sedda produkter"
- Toast notifications för actions (tillagd i varukorg, etc)

### Analytics & Rapportering

- Topplista produkter över tid
- Kategoriprestanda (vilken kategori säljer bäst)
- Tidsbaserad analys (bästa försäljningsdag/månad)

### Deployment & DevOps

- Deploya databas till molntjänst (Aiven, Railway, Supabase, Neon)
- Deploya backend till Render/Railway/Heroku
- Deploya frontend till Netlify/Vercel
- Environment variables för känslig data
