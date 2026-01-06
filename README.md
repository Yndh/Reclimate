# Reclimate

**Wybróbuj teraz**: [https://reclimate.vercel.app](https://reclimate.vercel.app)

## Nasza misja

Celem Reclimate jest zwiększenie świadomości o wpływie codziennych decyzji na środowisko, pomagając użytkownikom w zmniejszeniu swojego śladu węglowego. Reclimate angażuje do zmiany nawyków poprzez personalizowane wyzwania, edukację, oraz system rywalizacji, co motywuje do podejmowania realnych działań proekologicznych.

## Funkcje

- **Personalizowane ankiety** - Dostosowane pytania na podstawie odpowiedzi z poprzednich ankiet, pozwalające na dokładne określenie śladu węglowego.
- **Nowoczesny design** - Intuicyjny interfejs użytkownika (UI), zapewniający łatwą nawigację.
- **Monitorowanie postępów** - Śledzenie zmian w śladzie węglowym w formie wykresów.
- **Społeczność i rywalizacja** - Punkty za wyzwania tygodniowe i porównanie wyników z innymi użytkownikami.
- **Asystent AI** - Asystent, który udziela porad na temat ochrony środowiska i zmiany stylu życia.

## FAQ

1. **Na czym polega Reclimate?**
   Reclimate to aplikacja pomagająca użytkownikom zrozumieć ich indywidualny wpływ na środowisko i zmienić codzienne nawyki, by żyć bardziej zrównoważenie.

2. **Jak działa ankieta w aplikacji?**
   Użytkownik wypełnia interaktywną ankietę, która dostosowuje pytania na podstawie poprzednich odpowiedzi. Aplikacja wykorzystuje AI do dokładniejszego oszacowania śladu węglowego.

3. **Czy aplikacja jest dostępna na różnych platformach?**
   Tak, Reclimate jest aplikacją webową, przez co można jej używać na urządzeniach mobilnych (Android, iOS) czy komputerach (Windows, MacOS, Linux)

## O Projekcie

### Reclimate - Nasza Misja

Reclimate odpowiada na poważny problem, jakim jest niska świadomość o wpływie codziennych decyzji na środowisko. Dzięki aplikacji użytkownicy mogą zmieniać swoje nawyki, dążąc do bardziej zrównoważonego stylu życia. Z zastosowaniem sztucznej inteligencji (AI) oraz nowoczesnego designu, Reclimate daje użytkownikom narzędzie do głębszego zrozumienia ich śladu węglowego.

**Przeczytaj więcej o projekcie**: [https://reclimate.vercel.app/about](https://reclimate.vercel.app/about)

### Technologie

- **Next.js**
- **Prisma ORM**
- **Auth.js**
- **Gemini 2.5 Flash Lite**
- **React**
- **Tailwind CSS**

### Jak działa aplikacja?

1. **Ankieta** - Użytkownik wypełnia dynamicznie dopasowaną ankietę, która pomaga określić indywidualny ślad węglowy.
2. **Raport** - Aplikacja generuje raport, porównując wyniki użytkownika z średnią krajową i globalną.
3. **Dashboard** - Centrum aplikacji, gdzie użytkownik może monitorować swoje postępy.
4. **Społeczność i rywalizacja** - Użytkownicy zdobywają punkty za wykonane wyzwania, co motywuje do działania.
5. **Asystent AI** - Sztuczna inteligencja, która oferuje porady i informacje dotyczące klimatu i środowiska.

### Dlaczego warto?

Reclimate to aplikacja, która nie tylko pomaga w obliczeniu śladu węglowego, ale również aktywnie wspiera użytkowników w zmianie nawyków. Dzięki zastosowaniu AI oraz innowacyjnym funkcjom, aplikacja wyróżnia się na tle konkurencji, oferując spersonalizowane porady i angażując w działania proekologiczne.

---

**Zrób pierwszy krok ku bardziej zrównoważonemu stylowi życia. Dołącz do Reclimate teraz!**

## Instalacja

Aby uruchomić projekt lokalnie, postępuj zgodnie z poniższymi krokami:

### 1. Klonowanie repozytorium

Klonuj repozytorium na swój komputer:

```bash
git clone https://github.com/yndh/hakhiros2
cd reclimate
```

### 2. Instalowanie bibliotek

```bash
npm install
```

### 3. Konfiguracja pliku .env

| Zmienna                        | Typ    | Opis                                                                       |
| ------------------------------ | ------ | -------------------------------------------------------------------------- |
| `URL`                          | string | Adres URL aplikacji (np http://localhost:3000).                            |
| `SURVEY_COOLDOWN`              | number | Czas oczekiwania (cooldown) między wysłaniem ankiet, w godzinach.          |
| `DAILY_TOKEN_LIMIT`            | number | Limit dziennego zużycia output tokenów przez użytkownika.                  |
| `DATABASE_URL`                 | string | URL połączenia z bazą danych (PostgreSQL).                                 |
| `GOOGLE_GENERATIVE_AI_API_KEY` | string | Klucz API do Google.                                                       |
| `AUTH_SECRET`                  | string | Sekret służący do generowania i weryfikowania tokenów uwierzytelniających. |
| `AUTH_GITHUB_ID`               | string | ID aplikacji GitHub, używane w procesie uwierzytelniania przez GitHub.     |
| `AUTH_GITHUB_SECRET`           | string | Sekret aplikacji GitHub, wymagany do autentykacji przez GitHub.            |
| `AUTH_GOOGLE_ID`               | string | ID aplikacji Google, używane w procesie uwierzytelniania przez Google.     |
| `AUTH_GOOGLE_SECRET`           | string | Sekret aplikacji Google, wymagany do autentykacji przez Google.            |

### 4. Baza danych

Projekt korzysta z PostgreSQL z Prisma ORM. Po przypisaniu url bazdy danych uruchom:

```bash
npx prisma migrate dev
```

### 5. Uruchom aplikacje

```bash
npm run dev
```

### Gotowe! Ciesz się Reclimate na własnym komputerze
