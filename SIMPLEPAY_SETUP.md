# SimplePay Fizetőrendszer Beállítása

## 1. Környezeti változók beállítása

Hozz létre egy `.env.local` fájlt a projekt gyökerében (ahol a `package.json` van):

```bash
# SimplePay API Kulcsok
SIMPLEPAY_MERCHANT_ID=PUBLICTESTHUF
SIMPLEPAY_SECRET_KEY=FxDa5w314kLlNseq2sKuVwaqZshZT5d6
SIMPLEPAY_SANDBOX=true

# Fizetési beállítások
SIMPLEPAY_CURRENCY=HUF
SIMPLEPAY_TIMEOUT=600
SIMPLEPAY_METHODS=CARD

# Alkalmazás URL-ek
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> **Fontos**: A fenti kulcsok SimplePay publikus teszt kulcsai. Éles környezetben használd a saját SimplePay kulcsaidat!

## 2. Szerver újraindítása

A `.env.local` fájl létrehozása után **indítsd újra a fejlesztői szervert**:

```bash
# Állítsd le a szervert (Ctrl + C)
# Majd indítsd újra:
npm run dev
```

## 3. Tesztelés

### Checkout oldal tesztelése

Nyisd meg a böngészőben:
- **Starter csomag**: http://localhost:3000/checkout?package=starter
- **Professional csomag**: http://localhost:3000/checkout?package=professional
- **Enterprise csomag**: http://localhost:3000/checkout?package=enterprise
- **Ingyenes konzultáció**: http://localhost:3000/checkout?package=consultation

### Teszt fizetés

1. Töltsd ki az űrlapot
2. Kattints a "Fizetés indítása" gombra
3. Átirányít a SimplePay teszt fizetési oldalra
4. Használd a SimplePay teszt kártyaadatokat:
   - **Kártyaszám**: 4908 3660 9990 0425
   - **Lejárat**: bármilyen jövőbeli dátum (pl. 12/25)
   - **CVC**: bármilyen 3 számjegy (pl. 123)
   - **Név**: bármilyen név

5. Sikeres fizetés után visszairányít a `/payment/success` oldalra

## 4. Éles környezet beállítása

Amikor élesbe mész:

1. **SimplePay szerződés**: Kérj éles API kulcsokat a SimplePay-től
2. **Frissítsd a `.env.local` fájlt**:
   ```env
   SIMPLEPAY_MERCHANT_ID=your_production_merchant_id
   SIMPLEPAY_SECRET_KEY=your_production_secret_key
   SIMPLEPAY_SANDBOX=false
   NEXT_PUBLIC_BASE_URL=https://yourdomain.com
   ```
3. **HTTPS kötelező**: SimplePay csak HTTPS-en működik éles környezetben
4. **Domain whitelist**: Add hozzá a domained a SimplePay admin felületén

## 5. Hibaelhárítás

### "SimplePay configuration missing" hiba
- Ellenőrizd, hogy létrehoztad-e a `.env.local` fájlt
- Indítsd újra a szervert (`npm run dev`)

### "Payment start error"
- Nézd meg a konzolt (F12 → Console)
- Ellenőrizd a SimplePay API kulcsokat
- Sandbox módban vagy-e? (`SIMPLEPAY_SANDBOX=true`)

### Callback oldalak nem töltődnek be
- Ellenőrizd, hogy a `NEXT_PUBLIC_BASE_URL` helyes-e
- Lokálisan: `http://localhost:3000`
- Élesben: `https://yourdomain.com`

## 6. Következő lépések

- [ ] Teszteld a fizetési folyamatot sandbox környezetben
- [ ] Kérj éles SimplePay API kulcsokat
- [ ] Állítsd be az email értesítéseket
- [ ] Opcionálisan: Adatbázis integráció a rendelések tárolásához
