const supabaseURL = 'https://zmbentfvctwxbdhkfatq.supabase.co/rest/v1';
const headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptYmVudGZ2Y3R3eGJkaGtmYXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjczNjYsImV4cCI6MjA2ODYwMzM2Nn0.jtMLtEmhS8thmUotuj6i3PtBxqKBRJJ98wp9AsRyx1c',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptYmVudGZ2Y3R3eGJkaGtmYXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjczNjYsImV4cCI6MjA2ODYwMzM2Nn0.jtMLtEmhS8thmUotuj6i3PtBxqKBRJJ98wp9AsRyx1c',
    'Content-Type': 'application/json'
};

async function pokazDane() {
  const mode = document.getElementById("mode").value;
  const data = document.getElementById("date").value;
  const linia = document.getElementById("line").value;
  const zmiana = document.getElementById("shift").value;

  if (!data || !linia || !zmiana) {
    alert("❗ Uzupełnij wszystkie pola.");
    return;
  }

  let query = `${supabaseURL}/praca?linia=eq.${linia}&zmiana=eq.${zmiana}`;
  let infoText = "";

  if (mode === 'day') {
    query += `&data=eq.${data}`;
    infoText = `dnia ${data}`;
  } else if (mode === 'week') {
    const selectedDate = new Date(data);
    const startDate = new Date(selectedDate);
    startDate.setDate(selectedDate.getDate() - startDate.getDay() + 1); // poniedziałek
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // niedziela

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    query += `&data=gte.${startStr}&data=lte.${endStr}`;
    infoText = `od dnia ${startStr} do ${endStr}`;
  } else if (mode === 'month') {
    const selectedDate = new Date(data);
    const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 2); // pierwszy dzień miesiąca
    const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1); // ostatni dzień miesiąca

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    query += `&data=gte.${startStr}&data=lte.${endStr}`;
    infoText = `od dnia ${startStr} do ${endStr}`;
  }

  try {
    const res = await fetch(query, { headers });
    const wyniki = await res.json();

    if (!wyniki.length) {
      alert("Brak danych dla wybranych parametrów.");
      return;
    }
    if (!res.ok) throw new Error("❌ Nie udało się pobrać danych.");

    // Suma wartości dla całego zakresu
    let wykonano = 0;
    let wymagane = 0;
    let pracaIDs = [];
    let wykonano_max = -Infinity;
    let wykonano_min = Infinity;
    wyniki.forEach(r => {
      const zrobioneVal = parseInt(r.zrobione || 0);
      wykonano += zrobioneVal;
      wymagane += parseInt(r.wymagane || 0);
      if (zrobioneVal > wykonano_max) wykonano_max = zrobioneVal;
      if (zrobioneVal < wykonano_min) wykonano_min = zrobioneVal;
      pracaIDs.push(r.id);
    });

    if (document.getElementById("wyniki").style.opacity === "1") document.getElementById("wyniki").style.opacity = "0.5";
    document.getElementById("info-wyniki").textContent =
        `📊 Wyniki pracy dla linii ${linia} ze zmiany ${zmiana} ${infoText}`;

    const progressBar = document.getElementById("progress-bar");
    if (wymagane === 0) {
      progressBar.style.background = wykonano === 0
        ? 'linear-gradient(to right, #f44336 0%, #f44336 100%)'
        : 'linear-gradient(to right, #4caf50 0%, #4caf50 100%)';
    } else if (wykonano <= wymagane) {
      const procent = Math.max(0, Math.min(100, (wykonano / wymagane) * 100));
      progressBar.style.background = `linear-gradient(to right,
        #4caf50 0%, #4caf50 ${procent}%,
        #f44336 ${procent}%, #f44336 100%)`;
    } else {
      const procentNadmiaru = Math.max(0, Math.min(100, ((wykonano - wymagane) / wykonano) * 100));
      const split = 100 - procentNadmiaru;
      progressBar.style.background = `linear-gradient(to left,
        #4caf50 0%, #4caf50 ${split}%,
        #2e7d32 ${split}%, #2e7d32 100%)`;
    }

    if (mode === 'day') document.getElementById("info-zrobione").textContent = `Wykonano: ${wykonano}`;
    else document.getElementById("info-zrobione").textContent = `Wykonano: ${wykonano} (⭡${wykonano_max} ⭣${wykonano_min})`;
    document.getElementById("info-wymagane").textContent = `Wymagane: ${wymagane}`;
    document.getElementById("progress-text").textContent = `${((wykonano / wymagane) * 100).toFixed(2)}%`;
    document.getElementById("wyniki").style.display = 'block';

    await pobierzSzczegoly(pracaIDs, mode);

  } catch (err) {
    console.error(err);
    alert("❌ Wystąpił błąd podczas pobierania danych.");
  }
}

async function pobierzSzczegoly(praca_ids, mode) {
  try {
    if (!Array.isArray(praca_ids)) praca_ids = [praca_ids];

    const idListaPraca = praca_ids.join(',');

    // Pobieramy wszystkie powiązane dane
    const [resObsada, resProdukt, resPrzestoje, resPraca] = await Promise.all([
      fetch(`${supabaseURL}/obsada?praca_id=in.(${idListaPraca})`, { headers }),
      fetch(`${supabaseURL}/produkt?praca_id=in.(${idListaPraca})`, { headers }),
      fetch(`${supabaseURL}/przestoje?praca_id=in.(${idListaPraca})`, { headers }),
      fetch(`${supabaseURL}/praca?id=in.(${idListaPraca})`, { headers })
    ]);

    const [obsada, produkty, przestoje, praca] = await Promise.all([
      resObsada.json(), resProdukt.json(), resPrzestoje.json(), resPraca.json()
    ]);

    // Daty
    const daty = [...new Set(praca.map(p => p.data))].sort();
    document.getElementById("wyniki-daty").innerHTML = `📅 <b><u>Pobrane wyniki</u> z ${daty.length} dat:</b> <i>${daty.join(', ')}</i>`;
    document.getElementById("wyniki-daty").style.display = daty.length > 1 ? 'block' : 'none';

    // Braki
    const produktIDs = produkty.map(p => p.id);
    let braki = [];
    if (produktIDs.length > 0) {
      const idLista = produktIDs.join(',');
      const resBraki = await fetch(`${supabaseURL}/braki?produkt_id=in.(${idLista})`, { headers });
      braki = await resBraki.json();
    }

    // Wyświetlanie
    const kontener = document.getElementById("szczegoly");
    kontener.innerHTML = '';

    if (produkty.length > 0) {
      const grouped = {};
      produkty.forEach(p => {
        if (!grouped[p.indeks]) grouped[p.indeks] = { ok: 0, nok: 0, pull_out: false };
        grouped[p.indeks].ok += p.ilosc_ok || 0;
        grouped[p.indeks].nok += p.ilosc_nok || 0;
        if (p.pull_out) grouped[p.indeks].pull_out = true;
      });
      const box = document.createElement("div");
      box.className = "box";
      box.innerHTML = `<h3>🛠️Produkty</h3><ul>${
        Object.entries(grouped)
          .sort((a, b) => b[1].ok - a[1].ok) // sortowanie malejąco po ilości OK
          .map(([indeks, d]) => `<li><b>${indeks}</b><br/>✅${d.ok} 🚫${d.nok}${d.pull_out ? ', 🚫PullOut' : ''}</li>`).join('')}</ul>`;
      kontener.appendChild(box);
    }

    if (przestoje.length > 0) {
      const grouped = {};
      przestoje.forEach(p => {
        if (!grouped[p.odpis]) grouped[p.odpis] = { minuty: 0, notatki: [] };
        grouped[p.odpis].minuty += p.minuty || 0;
        if (p.notatka) grouped[p.odpis].notatki.push(p.notatka);
      });
      const box = document.createElement("div");
      box.className = "box";
      box.innerHTML = `<h3>⚠️Przestoje</h3><ul>${
        Object.entries(grouped)
          .sort((a, b) => b[1].minuty - a[1].minuty) // sortowanie po minutach malejąco
          .map(([odpis, d]) =>
            `<li><b>${odpis}</b> ⏳${d.minuty}min${d.notatki.length
              ? ` <br/>📋<i>${[...new Set(d.notatki)].join('</i><br/>📋<i>')}</i>`
              : ''}</li>`
          ).join(' ')}</ul>`;
      kontener.appendChild(box);
    }

    if (braki.length > 0) {
      const pullOutCount = braki.filter(b => b.kategoria === "Pull Out").reduce((sum, b) => sum + b.ilosc, 0);
      const grouped = {};
      braki.forEach(b => {
        if (b.kategoria === "Pull Out") return;
        if (!grouped[b.stacja]) grouped[b.stacja] = {};
        if (!grouped[b.stacja][b.kategoria]) grouped[b.stacja][b.kategoria] = 0;
        grouped[b.stacja][b.kategoria] += b.ilosc;
      });
      const box = document.createElement("div");
      box.className = "box";
      box.innerHTML = `<h3>🚫Braki</h3>`;
      const ul = document.createElement("ul");
      if (pullOutCount > 0) {
        const li = document.createElement("li");
        li.innerHTML = `<b>${pullOutCount}×</b> Pull Out`;
        ul.appendChild(li);
      }
      for (const stacja in grouped) {
        const kategorie = grouped[stacja];
        const lista = Object.entries(kategorie)
          .sort((a, b) => b[1].ilosc - a[1].ilosc)
          .map(([kat, ilosc]) => `<b>${ilosc}×</b> ${kat}<br/>`)
          .join(' ');
        const li = document.createElement("li");
        li.innerHTML = `<b><u>${stacja}</u></b><br/> ${lista}`;
        ul.appendChild(li);
      }
      box.appendChild(ul);
      kontener.appendChild(box);
    }

    if (obsada.length > 0) {
      const box = document.createElement("div");
      box.className = "box";
      box.innerHTML = `<h3>👥Obsada</h3>`;

      if (mode !== 'day') {
        const totalCounts = praca_ids.length;
        const counts = {};
        const totalPercent = {};
        obsada.forEach(o => {
          const name = o.nazwisko || '(brak)';
          counts[name] = (counts[name] || 0) + 1;
          totalPercent[name] = ((counts[name] / totalCounts) * 100).toFixed(2);
        });

        const nazwiska = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
        box.innerHTML += `<ul>` +
          nazwiska.map(n => `<li><b>${n}</b><br/>${counts[n]}/${totalCounts} ┃ ${totalPercent[n]}%</li>`).join('') +
          `</ul>`;
      } else {
        // Tryb dzienny — tylko lista nazwisk bez licznika
        const nazwiska = [...new Set(obsada.map(o => o.nazwisko || '(brak)'))];
        box.innerHTML += `<ul>${nazwiska.map(n => `<li>${n}</li>`).join('')}</ul>`;
      }
      kontener.appendChild(box);
    }

    kontener.style.display = "flex";
    document.getElementById("wyniki").style.opacity = "1";
  } catch (err) {
    console.error("❌ Błąd przy pobieraniu danych szczegółowych:", err);
    alert("❌ Nie udało się pobrać szczegółów.");
  }
}
