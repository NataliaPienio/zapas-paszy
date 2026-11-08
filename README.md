# Zapas paszy

Prosta aplikacja do pilnowania zapasu paszy dla konia. Dodajesz paszę (nazwa, kg w opakowaniu, ile kupione, ile schodzi dziennie), a aplikacja liczy, do kiedy starczy, i ostrzega kilka dni przed końcem.

## Jak uruchomić

Otwórz `index.html` w przeglądarce. Nie trzeba niczego instalować.

## Pliki

- `index.html` – struktura strony
- `style.css` – wygląd (kolory są na górze pliku, w `:root`)
- `app.js` – logika: obliczenia, formularze, zapis w przeglądarce (localStorage)

## Jak to liczy

Przy zakupie zapisujemy ilość paszy i datę. Ile zostało dziś = ilość w dniu zakupu minus (dni od zakupu × zużycie dzienne). Z tego wychodzi, na ile dni starczy i do kiedy trzeba zamówić (domyślnie 5 dni przed końcem).