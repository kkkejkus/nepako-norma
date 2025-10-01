<div align="center">
	
# 🛠️ nepako-norma
Lekki, przeglądarkowy kalkulator norm produkcyjnych + moduł raportowania i statystyk.

<sub><b>Status:</b> <code>v1.4</code> – projekt uznany za zakończony, dalszy rozwój nieplanowany.</sub>
</div>

## ✨ Co robi aplikacja?
1. Oblicza wymaganą liczbę sztuk do wyprodukowania na zmianie na podstawie: wybranej normy, braków (z wagami), przezbrojeń, braków obsady oraz dodatkowych odpisów (przestojów).
2. Dynamicznie pokazuje ile jeszcze brakuje (kolorowe ostrzeżenia) lub czy norma została przekroczona (warning przed zawyżaniem).
3. Pozwala wprowadzić szczegółowy podział braków na kategorie i stacje – generuje gotowe do wydruku dwie tabele „RAPORT PRODUKCJI”.
4. Zapisuje dane (obsada, produkty, przestoje, braki) do bazy (Supabase) – potem można je przeglądać w zakładce STATYSTYKI (widoki: dzień / tydzień / miesiąc).
5. Wyświetla zagregowane statystyki: wykonano vs wymagane, procent realizacji, zakres dat, najczęstsze przestoje, udział braków, obsadę.

## 🧩 Najważniejsze funkcje
- Dodawanie indeksów z automatycznym sumowaniem braków i ich wag.
- Obsługa maksymalnych limitów (np. 7 indeksów, 6 przezbrojeń, 4 pozycje braków obsady, 11 odpisów dodatkowych).
- Wariant responsywny nagłówków tabel przy mniejszych szerokościach okna.
- Interaktywny formularz rozszerzony do przypisywania braków do kategorii.
- Generowanie dwóch arkuszy raportu (tabela przestojów / obsady + tabela produktów i braków szczegółowych) w widoku drukowania modalnego.
- Eksport (POST) do Supabase wielu powiązanych tabel: `praca`, `obsada`, `przestoje`, `produkt`, `braki` (z relacją przez `praca_id` i `produkt_id`).
- Panel statystyk (`stats.html`) z agregacją i podświetlaną belką postępu (gradient zależny od realizacji).

## 📂 Struktura plików
```
index.html     – główny kalkulator normy
stats.html     – moduł statystyk (pobieranie danych z Supabase)
style.css      – stylowanie całości
script.js      – logika kalkulatora, modal drukowania, zapis do bazy
script2.js     – logika pobierania i agregacji statystyk
README.md      – dokumentacja
```

## 🔢 Algorytm liczenia
1. Suma braków na wiersz = suma sztuk NOK + wersja ważona (wagi z `wagi = { krzyzak, przegub, tulipan, pion }`).
2. Norma efektywna pomniejszana o:
	- przestoje przezbrojeń (minuty × mnożnik normy 1.3 lub 1.5 przy normie ≥ 600),
	- ¼ braków obsady (redukcja normy przez obecność),
	- pozostałe odpisy (minuty × mnożnik jak wyżej),
	- ważone braki sztuk.
3. Wyliczone wymagane sztuki zaokrąglane do ilości „na przekładkę” i porównywane z faktycznie „Zrobione”.
4. Podpowiedź zakresu (góra/dół) względem ostatniej liczby „na przekładkę”, aby łatwiej oszacować realny cel.

## 🖨️ Drukowanie raportu
Kliknięcie ikony drukarki otwiera modal:
- Formularz obsady + przypisanie braków do kategorii.
- Po zatwierdzeniu – generowane dwie tabele (do druku dwustronnego A5) oraz (opcjonalnie) możliwość zapisania pełnego zestawu danych do bazy (Supabase).

## 📊 Statystyki (`stats.html`)
Wybierasz datę, linię, zmianę oraz tryb zakresu (dzień / tydzień / miesiąc). Aplikacja:
- Pobiera rekordy pracy.
- Renderuje belkę progresu według zrobionych/wymaganych sztuk.
- Agreguje: produkty (OK/NOK), przestoje (minuty + notatki), braki (wg stacji i kategorii), obsadę (z udziałem % przy agregacji wielodniowej).

## 🗄️ Backend / Baza
Używany jest Supabase REST API (fetch). Dane trafiają do następujących tabel:
- `praca` – podstawowy rekord (linia, data, zmiana, zrobione, wymagane)
- `obsada` – wiele nazwisk do jednej pracy
- `przestoje` – typ odpisu + minuty + notatka
- `produkt` – indeks + ilości OK/NOK
- `braki` – szczegółowy podział (stacja, kategoria, ilość)

⚠️ Uwaga: W repozytorium znajdują się jawne klucze `apikey` / `Authorization`. W środowisku produkcyjnym należy:
1. Przenieść klucze do zmiennych środowiskowych.
2. Ograniczyć polityką RLS (Row Level Security) i utworzyć dedykowane role.
3. Ewentualnie dodać prostą warstwę proxy (np. Cloudflare Worker / mały serwer) filtrującą dozwolone operacje.

## 🚀 Szybki start (lokalnie)
1. Sklonuj repo lub pobierz ZIP.
2. Otwórz `index.html` w przeglądarce (wystarczy plik lokalny – brak bundlera).
3. (Opcjonalnie) uruchom prosty serwer statyczny, aby uniknąć problemów z CORS w przyszłych rozszerzeniach.

## 🛡️ Znane ograniczenia / uwagi
- Brak walidacji unikalności indeksów (można dodać duplikaty).
- Brak trybu offline / lokalnej persistencji (odświeżenie czyści dane).
- Brak mechanizmu autoryzacji zapisu do bazy (każdy z kluczami może POSTować).
- Brak testów automatycznych.
- Responsywność na bardzo małych ekranach – jeszcze do dopracowania.

## 🗺️ Roadmap / dalsze pomysły
### ✅ Zrealizowane
- [v1.2] Usprawniona responsywność na urządzeniach mobilnych.
- [v1.3] Generator arkuszy raportowych (druk 1:1 / A5) poprzez modal z dedykowanym layoutem.
- [v1.4] Trwały zapis do bazy (Supabase) + panel statystyk produkcji.
- [ ] Optymalizacja / Skrócenie plików JS.
- [ ] Konfiguracja środowiskowa (.env) + usunięcie kluczy jawnych.
- [ ] Autoryzacja / logowanie użytkowników (rola: lider / pracownik / viewer).
- [ ] Eksport CSV / XLSX z zakresu dat.
- [ ] Walidacja i podpowiedzi przy kategoriach braków (np. automatyczne równoważenie).
- [ ] Dark mode.

## 📄 Licencja / status projektu
To narzędzie powstało kompletnie hobbystycznie – z odrobiny nudy i jako pretekst do pogłębienia wiedzy z JavaScript (manipulacja DOM, dynamiczne formularze, generowanie raportów, integracja z Supabase oraz prosty „data pipeline” w czystym froncie). Nie jest to produkt komercyjny ani oficjalne narzędzie żadnej firmy.

