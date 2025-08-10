function aktualizujDateGodzineIZmiane() {
  const teraz = new Date();
  const godzina = teraz.getHours();
  const minuta = teraz.getMinutes().toString().padStart(2, '0');
  const sekunda = teraz.getSeconds().toString().padStart(2, '0');
  const data = teraz.toLocaleDateString('pl-PL');
  const godzinaTekst = `${godzina}:${minuta}:${sekunda}`;

  let zmiana;
  if (godzina >= 6 && godzina < 14) zmiana = 'I';
  else if (godzina >= 14 && godzina < 22) zmiana = 'II';
  else zmiana = 'III';

  const dataElem = document.getElementById('data-dzis');
  const godzinaElem = document.getElementById('godzina-teraz');
  const zmianaElem = document.getElementById('zmiana');

  if (dataElem && godzinaElem && zmianaElem) {
    dataElem.textContent = data;
    godzinaElem.textContent = godzinaTekst;
    zmianaElem.textContent = `Zmiana ${zmiana}`;
  }
}

const wagi = {
  krzyzak: 0.5,
  przegub: 1,
  tulipan: 0,
  pion: 1,
};

function updateTableHeaders() {
  const headers = document.querySelectorAll('th.responsive-th');
  const windowWidth = window.innerWidth;
  headers.forEach(th => {
    if (!th.dataset.full) th.dataset.full = th.innerHTML
    if (windowWidth < 900) th.innerHTML = th.dataset.short || th.dataset.full;
    else th.innerHTML = th.dataset.full;
  });
}

function usunWiersz(event) {
  const btn = event.target;
  const tr = btn.closest('tr');
  if (!tr) return;

  const tableBody = tr.parentElement;
  const table = tableBody.closest('table');
  if (!table) return;

  if (table.id === 'data-table') {
    // wariant dla data-table
    const allRows = tableBody.querySelectorAll('tr');
    if (allRows.length > 1) {
      const isLastRow = (tr === allRows[allRows.length - 1]);
      tr.remove();
      aktualizuj();
      if (isLastRow) {
        const newLastTr = tableBody.querySelector('tr:last-child');
        newLastTr.querySelectorAll('td').forEach(td => {
          td.classList.remove('nbb');
          td.style.paddingBottom = '';
        });
      }
    }
    else {
      tr.remove();
      dodajIndex();
    }
  } else if (table.id === 'odpisy-table') {
    const trWithWideInput = Array.from(tableBody.querySelectorAll('tr')).filter(row => {
      return row.querySelector('select[class*="odpis-select"]');
    });

    const hasWideInput = tr.querySelector('select[class*="odpis-select"]') !== null;

    if (hasWideInput && trWithWideInput.length > 1) {
      tr.remove();
      aktualizuj();
      const newLastTr = tableBody.querySelector('tr:last-child');
      if (newLastTr) {
        newLastTr.querySelectorAll('td').forEach(td => {
          td.classList.remove('nbb');
          td.style.paddingBottom = '';
        });
      }
    } else {
      tr.remove();
      aktualizuj();
      dodajOdpis();
    }
  }
}

window.addEventListener('DOMContentLoaded', updateTableHeaders);
window.addEventListener('resize', updateTableHeaders);

function dodajPrzezbrojenie() {
  const container = document.querySelector('.przezbrojenia-row');
  const inputs = container.querySelectorAll('input[type="number"]');
  if (inputs.length >= 6) return; // max 6

  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'numeric-input';
  input.max = '480';
  input.min = '10';
  input.step = '5';
  input.placeholder = 'Minuty';

  input.addEventListener('input', aktualizuj);
  
  if (container.children.length <= 0) container.insertBefore(input, container.lastElementChild);
  else container.lastElementChild.after(input);
  container.lastElementChild.after(input);
}

function dodajBrakObsady() {
  const container = document.querySelector('.brak-obsady-row');
  const inputs = container.querySelectorAll('input[type="number"]');
  if (inputs.length >= 4) return; // max 4

  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.className = 'br1';
  inputText.placeholder = 'Pracownik';

  const inputNumber = document.createElement('input');
  inputNumber.type = 'number';
  inputNumber.className = 'numeric-input brak-obsady br2';
  inputNumber.max = '480';
  inputNumber.min = '15';
  inputNumber.step = '15';
  inputNumber.placeholder = 'Minuty';

  inputNumber.addEventListener('input', aktualizuj);

  if (container.children.length <= 1) container.insertBefore(inputText, container.lastElementChild);
  else container.lastElementChild.after(inputText);
  container.lastElementChild.after(inputText);
  inputText.after(inputNumber);
}

function dodajOdpis() {
  const table = document.getElementById('odpisy-table');
  const tbody = table.querySelector('tbody');
  const row = document.createElement('tr');
  const inputs = table.querySelectorAll('tr');
  if (inputs.length >= 3 + 11) return; // max 11
  const td = document.createElement('td');
  td.colSpan = 2;
  td.className = 'odpisy-row nbt';
  td.innerHTML = `
    <div class="input-wrapper">
    <input 
      type="number" 
      class="numeric-input br1" 
      max="480" 
      min="10" 
      step="5" 
      placeholder="Minuty" 
      style="width: 8%" 
    />
    <select class="odpis-select" style="width: 27%; margin-left: -6px; border-radius: 0">
      <option disabled selected>Wybierz odpis</option>
      <option></option>
      <option>Awaria</option>
      <option>Brak możliwości raportowania</option>
      <option>Brak odpowiedzi serwera</option>
      <option>Czyszczenie kamery</option>
      <option>Dorzucanie przegubu</option>
      <option>Kalibracja kleszczy</option>
      <option>Oczekiwanie na materiał</option>
      <option>Odtłuszczanie</option>
      <option>Próby technologiczne</option>
      <option>Selekcja materiału</option>
      <option>Szkolenie stanowiskowe</option>
      <option>Utrudniona produkcja</option>
      <option>Wycieranie przegubu</option>
      <option>Wymiana etykiety</option>
      <option>Wymiana klasy</option>
      <option>Zacinanie pierścienia</option>
      <option>Zazębianie NOK</option>
      <option>Zmiana parametrów</option>
    </select>
    <input 
      type="text" 
      class="br2" 
      placeholder="Dodatkowa notatka do odpisu..." 
      style="width: 65%; margin-left: -6px" 
    />
    <span class="bin" onclick="usunWiersz(event)">🗑️</span>
    </div>
  `;

  row.appendChild(td);

  const newSelect = td.querySelector('select.odpis-select');
  const updateColor = () => {
    const selectedOption = newSelect.options[newSelect.selectedIndex];
    if (selectedOption.disabled && selectedOption.selected) newSelect.classList.add('placeholder');
    else newSelect.classList.remove('placeholder');
  };
  updateColor();
  newSelect.addEventListener('change', updateColor);

  const lastRow = tbody.lastElementChild;
  if (lastRow) {
    const lastTd = lastRow.querySelector('td');
    if (lastTd) {
      lastTd.classList.add('nbb');
      lastTd.style.paddingBottom = '0';
    }
  }

  tbody.appendChild(row);
}

function dodajIndex(index = '') {
  const table = document.getElementById('data-table');
  const tableBody = table.querySelector('tbody');
  const ostatniWiersz = tableBody.lastElementChild;
  const inputs = tableBody.querySelectorAll('input[placeholder="Numer indeksu"]');
  if (inputs.length >= 7) return; // max 7

  if (ostatniWiersz) {
    ostatniWiersz.querySelectorAll('td').forEach(td => {
      td.classList.add('nbb');
      td.style.paddingBottom = '0';
    });
  }
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="nbr nbt"><div class="input-wrapper"><input type="text" placeholder="Numer indeksu" value="${index}" /><span class="bin" onclick="usunWiersz(event)">🗑️</span></div></td>
    <td class="nbl nbr nbt">
      <select class="warstwa-select">
        <option value="6">6</option>
        <option value="8" selected>8</option>
        <option value="9">9</option>
      </select>
    </td>
    <td class="nbl nbr nbt"><input type="number" class="sztuki" value="0" min="0" /></td>
    <td class="nbl nbr nbt suma-brakow">0</td>
    <td class="nbl nbr nbt"><input type="number" class="brak krzyzak" value="0" min="0" /></td>
    <td class="nbl nbr nbt"><input type="number" class="brak przegub" value="0" min="0" /></td>
    <td class="nbl nbr nbt"><input type="number" class="brak tulipan" value="0" min="0" /></td>
    <td class="nbl nbt"><input type="number" class="brak pion" value="0" min="0" /></td>
  `;
  tableBody.appendChild(tr);

  tr.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', aktualizuj);
    el.addEventListener('change', aktualizuj);
  });

  aktualizuj();
}

function aktualizuj() {
  let sumaWazonaBrakow = 0;
  let sumaWymagana = 0;
  let sumaZrobiona = 0;


  document.querySelectorAll('.warstwa-select').forEach(select => {
    function ustawKolor() {
      const val = select.value;
      let kolor = {
        '6': '#acacac',
        '8': '#1da74b',
        '9': '#db2ba0'
      }[val] || 'white';

      select.style.backgroundColor = kolor;
    }

    ustawKolor(); // Początkowo
    select.addEventListener('change', ustawKolor);
  });

  // Sumy braków
  document.querySelectorAll('#table-body tr').forEach(row => {
    const sztuki = parseInt(row.querySelector('.sztuki')?.value) || 0;
    const brakKrzyzak = parseInt(row.querySelector('.krzyzak')?.value) || 0;
    const brakPrzegub = parseInt(row.querySelector('.przegub')?.value) || 0;
    const brakTulipan = parseInt(row.querySelector('.tulipan')?.value) || 0;
    const brakPion = parseInt(row.querySelector('.pion')?.value) || 0;

    const iloscBrakow = brakKrzyzak + brakPrzegub + brakTulipan + brakPion;
    const wazonaIlosc = (
      brakKrzyzak * wagi.krzyzak +
      brakPrzegub * wagi.przegub +
      brakTulipan * wagi.tulipan +
      brakPion * wagi.pion
    );

    const sumaBrakowCell = row.querySelector('.suma-brakow');
    const wazonaFormatted = wazonaIlosc.toFixed(1).replace('.', ',');
    sumaBrakowCell.innerHTML = `${iloscBrakow} (<strong>${wazonaFormatted}</strong>)`;

    sumaWazonaBrakow += wazonaIlosc;
    sumaZrobiona += sztuki;
  });

  const norma = parseInt(document.getElementById('norma').value);
  const normaMnoznik = norma >= 600 ? 1.5 : 1.3;

  // Suma przezbrojeń
  let sumaPrzezbrojenia = 0;
  let sumaSztPrzezbrojenia = 0;
  document.querySelectorAll('.przezbrojenia-row input').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) sumaPrzezbrojenia += val;
  });
  sumaSztPrzezbrojenia = Math.floor(sumaPrzezbrojenia * normaMnoznik);
  document.getElementById('suma-przezbrojenia').textContent = `${sumaPrzezbrojenia}min | -${sumaSztPrzezbrojenia}szt`;

  // Suma braków obsady
  let sumaBrakObsady = 0;
  let sumaSztBrakObsady = 0;
  document.querySelectorAll('.brak-obsady-row input[type="number"]').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) sumaBrakObsady += val;
  });

  let wspolczynnikObecnosci = (480 - sumaBrakObsady) / 480;
  let zmniejszonaNorma = norma * wspolczynnikObecnosci;

  sumaSztBrakObsady = Math.round(0.25 * (norma - zmniejszonaNorma));
  document.getElementById('suma-brak-obsady').textContent = `¼×${sumaBrakObsady}min | -${sumaSztBrakObsady}szt`;


  // Suma wszystkich odpisów (w tym przezbrojeń i braków obsady)
  let sumaOdpisowMinuty = 0;
  document.querySelectorAll('.numeric-input').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val) && input.closest('.odpisy-row')) sumaOdpisowMinuty += val;
  });
  let sztukiDoOdjeciaZaOdpisy = sumaOdpisowMinuty * normaMnoznik;
  sumaOdpisowMinuty += sumaPrzezbrojenia + (sumaBrakObsady * 0.25);
  sztukiDoOdjeciaZaOdpisy += sumaSztPrzezbrojenia + sumaSztBrakObsady;

  document.getElementById('suma-odpisy').textContent = `${sumaOdpisowMinuty}min | -${Math.round(sztukiDoOdjeciaZaOdpisy)}szt`;

  sumaWymagana = norma - sumaWazonaBrakow - sztukiDoOdjeciaZaOdpisy;
  sumaWymagana = Math.round(sumaWymagana);

  const warning = document.getElementById('warning');
  warning.textContent = '';

  if (sumaZrobiona < sumaWymagana) {
    const naWarstweInputs = document.querySelectorAll('.warstwa-select');
    const ostatniaWarstwa = parseInt(naWarstweInputs[naWarstweInputs.length - 1]?.value) || 1;

    let dol, gora;

    if (sumaWymagana % ostatniaWarstwa === 0) {
      dol = sumaWymagana - ostatniaWarstwa;
      gora = sumaWymagana + ostatniaWarstwa;
    } else {
      dol = sumaWymagana - (sumaWymagana % ostatniaWarstwa);
      gora = dol + ostatniaWarstwa;
    }

    const roznica = sumaWymagana - sumaZrobiona;
    const kolor = roznica <= 20 ? 'orange' : 'crimson';

    const output = document.getElementById('output');
    output.textContent = `Powinieneś zrobić ${sumaWymagana} (± ${dol}/${gora}) zamiast ${sumaZrobiona}!`;
    output.style.color = kolor;
  } else {
    sumaWymagana = Math.max(0, sumaWymagana);
    output.textContent = `Zrobione: ${sumaZrobiona}, wymagane: ${sumaWymagana}.`;
    const roznica = sumaZrobiona - sumaWymagana;

    output.style.color = 'green';

    if (roznica > 10) {
      warning.textContent = 'Nie zawyżaj normy!!!';
      warning.style.color = 'orange';
      if (roznica > 20) warning.style.color = 'crimson';
    }
  }

  output.dataset.sumaZrobiona = sumaZrobiona;
  output.dataset.sumaWymagana = sumaWymagana;
}

function dodajPrintModal() {
  const modal = document.createElement('div');
  modal.id = 'print-modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div id="print-content">
      <div id="tabelki">
        <div style="text-align: right; margin: -8px">
          <button id="print-button" class="emote-button" onclick="window.print()">🖨️</button>
          <button id="zamknij-button" class="emote-button" onclick="zamknijModal()">❌</button>
        </div>
        <table class="print-table" id="print-table-1">
          <p>RAPORT PRODUKCJI</p>
          <thead>
            <tr>
              <th style="width: 15%;">CZAS [min]</th>
              <th>Opis</th>
              <th style="width: 25%; border-width: 2px 2px 1px 2px">Obsada</th>
            </tr>
            <tr>
              <th>Przezbrojenia</th>
              <td rowspan="3"><input type="text" /></td>
              <td style="border-width: 1px 2px 1px 2px"><input type="text" style="text-align: right" /></td>
            </tr>
            <tr>
              <td rowspan="2"><input type="text" /></td>
              <td style="border-width: 1px 2px 1px 2px"><input type="text" style="text-align: right" /></td>
            </tr>
            <tr>
              <td style="border-width: 1px 2px 1px 2px"><input type="text" style="text-align: right" /></td>
            </tr>
            <tr>
              <th>Brak obsady</th>
              <td rowspan="3"><input type="text" /></td>
              <td style="border-width: 1px 2px 1px 2px"><input type="text" style="text-align: right" /></td>
            </tr>
            <tr>
              <td rowspan="2"><input type="text" /></td>
              <td style="border-width: 1px 2px 1px 2px"><input type="text" style="text-align: right" /></td>
            </tr>
            <tr style="height:6px">
              <td style="border-width: 1px 2px 2px 2px"><input type="text" style="text-align: right" /></td>
            </tr>
            <tr><th colspan="3">Awarie / Przestoje / Zakłócenia / Inne</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="text"/></td>
              <td colspan="2" height="1.5rem"><input type="text"" /></td>
            </tr>
            <tr>
              <td><input type="text"/></td>
              <td colspan="2" height="1.5rem"><input type="text"" /></td>
            </tr>
            <tr>
              <td><input type="text"/></td>
              <td colspan="2" height="1.5rem"><input type="text"" /></td>
            </tr>
            <tr>
              <td><input type="text"/></td>
              <td colspan="2"><input type="text"" /></td>
            </tr>
            <tr>
              <td><input type="text"/></td>
              <td colspan="2" height="1.5rem"><input type="text"" /></td>
            </tr>
            <tr>
              <td><input type="text"/></td>
              <td colspan="2"><input type="text"" /></td>
            </tr>
            <tr>
              <td><input type="text"/></td>
              <td colspan="2" height="1.5rem"><input type="text"" /></td>
            </tr>
            <tr>
              <td><input type="text"/></td>
              <td colspan="2"><input type="text"" /></td>
            </tr>
            <tr>
              <td><input type="text"/></td>
              <td colspan="2" height="1.5rem"><input type="text"" /></td>
            </tr>
            <tr>
              <td><input type="text"/></td>
              <td colspan="2"><input type="text"" /></td>
            </tr>
            <tr>
              <td><input type="text"/></td>
              <td colspan="2"><input type="text"" /></td>
            </tr>
          </tbody>
        </table>
        <table class="print-table" id="print-table-2">
          <p>RAPORT PRODUKCJI</p>
          <thead>
            <tr>
              <th style="width: 17%; border-bottom: 0; background: #FFF">Data:<input type="text" style="text-align:center" /></th>
              <th style="width: 7%; border-bottom: 0; background: #FFF"">Linia:<input type="text" style="text-align:center" /></th>
              <th style="width: 6%; border-bottom: 0; background: #FFF"">Zmiana:<input type="text" style="text-align:center" /></th>
              <th colspan="20">Braki</th>
            </tr>
            <tr>
              <th rowspan="2">Nr SAP wyrobu</th>
              <th rowspan="2">Ilość ogółem</th>
              <th rowspan="2">Ilość OK</th>
              <th rowspan="2">PC</th>
              <th rowspan="2">PL</th>
              <th rowspan="2">PP</th>
              <th rowspan="2">P/Y</th>
              <th rowspan="2">KC</th>
              <th rowspan="2">KL</th>
              <th colspan="14" style="height:1px">Inne braki X</th>
            </tr>
            <tr>
              <th>Przer- wana kurtyna</th>
              <th>Uszko- dzenie mech.</th>
              <th>Trace- ability SERVER</th>
              <th>Błąd hamulca BREAK</th>
              <th>Zazę- bienie NOK</th>
              <th>Waga smaru NOK</th>
              <th>Pozycja tłumika NOK</th>
              <th>Średnica wałka NOK</th>
              <th>Zablo- kowany pierścień</th>
              <th>Opas- ka NOK</th>
              <th>Osło- nka NOK</th>
              <th>Rozsy- pane CG</th>
              <th>TC</th>
              <th>TL</th>
            </tr>
          </thead>
          <tbody>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
            <tr>${'<td><input type="text" /></td>'.repeat(23)}</tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('print-button').addEventListener('click', () => {
    modal.style.display = 'flex';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  dodajOdpis();
  dodajIndex();
  dodajPrintModal();
  aktualizujDateGodzineIZmiane();
  setInterval(aktualizujDateGodzineIZmiane, 1000);
});

document.addEventListener('change', aktualizuj);

let klikPozaModal = null;

function zamknijModal() {
  const modal = document.getElementById('print-modal');
  modal.classList.remove('show');
  setTimeout(() => {
    document.getElementById("formularz-do-wyjebania")?.remove();
    modal.style.display = 'none';
  }, 250);
  if (klikPozaModal) {
    document.removeEventListener('click', klikPozaModal);
    klikPozaModal = null;
  }
  if (typeof escListener === 'function') document.removeEventListener('keydown', escListener);
}

function otworzModal() {
  const modal = document.getElementById('print-modal');
  const content = document.getElementById('print-content');
  modal.style.display = 'flex';

  let obsada = [];
  let kategoriaDoKolumny = {};
  let brakiIndexMap = {};
  let rozszerzoneKategorie = {};

  document.getElementById("tabelki").style.display = 'none';
  content.insertAdjacentHTML("beforeend", `
    <div id="formularz-do-wyjebania">
      <div style="text-align: right">
        <button id="submit-button" class="emote-button" type="button">✅</button>
        <button id="cancel-button" class="emote-button" onclick="zamknijModal()">❌</button>
      </div>
      <form id="rozszerzony-formularz">
        <h2>👨‍🔧OBSADA👩‍🔧</h2>
        <div id="obsada-box">
          ${Array.from({ length: 2 }).map(() =>
            '<input type="text" placeholder="Nazwisko i Imię" class="obsada-input" />'
          ).join('')}
          <button id="dodaj-osobe-btn" type="button" onclick="dodajPoleObsady()">+ Dodaj osobę</button>
        </div>
        <h2>🚫BRAKI🚫</h2>
        <div id="braki-fields"></div>
      </form>
    </div>
  `);

  const brakiDiv = document.getElementById("braki-fields");

  document.querySelectorAll("#table-body tr").forEach((row, i) => {
    const indeks = row.querySelector('td input')?.value || `Indeks ${i + 1}`;
    const braki = {
      ST50: parseInt(row.querySelector(".pion")?.value || 0),
      ST30: parseInt(row.querySelector(".przegub")?.value || 0),
      ST10: parseInt(row.querySelector(".krzyzak")?.value || 0),
      ST40: parseInt(row.querySelector(".tulipan")?.value || 0),
    };

    const kategorieUniwersalne = [
      "Przerwana kurtyna", "Uszkodzenie mech.", "Traceability SERVER", "Błąd hamulca BREAK",
      "Zazębienie NOK", "Waga smaru NOK", "Pozycja tłumika NOK",
      "Średnica wałka NOK", "Zablokowany pierścień", "Opaska NOK", "Osłonka NOK"
    ];

    const kategorieSpecyficzne = {
      ST50: ["PC", "PL", "PP", "P/Y"],
      ST30: ["PC", "PL", "PP", "P/Y"],
      ST10: ["KC", "KL"],
      ST40: ["Rozsypane CG", "TC", "TL"]
    };

    for (const [key, val] of Object.entries(braki)) {
      if (!document.getElementById(`blok-${indeks}`)) {
        const warstwaSelect = row.querySelector('.warstwa-select');
        const borderColor = warstwaSelect?.style.backgroundColor || '#007bff';

        const blok = document.createElement("div");
        blok.className = "blok-indeksu";
        blok.id = `blok-${indeks}`;
        blok.style.borderLeft = `3px solid ${borderColor}`;
        blok.style.borderRight = `0.5px dashed ${borderColor}`;

        const naglowek = document.createElement("div");
        naglowek.className = "naglowek-indeksu";
        naglowek.innerHTML = `
          <span>🛠️<u>Nr SAP wyrobu:</u> <b>${indeks}</b></span>
          <div class="rodzajBraku" style="width:15%; padding: 4px 8px">
            <span style="width:80%; font-weight:initial">Pull Out</span>
            <input type="checkbox" />
          </div>
        `;

        blok.appendChild(naglowek);
        brakiDiv.appendChild(blok);
      }

      if (val > 0) {
        const blok = document.getElementById(`blok-${indeks}`);
        const el = document.createElement("div");
        el.className = "brak-wiersz";

        const katSpec = kategorieSpecyficzne[key] || [];
        const wszystkieKategorie = [...katSpec, ...kategorieUniwersalne];

        const katHTML = wszystkieKategorie.map(kat => {
          return `
            <div class="rodzajBraku">
              <span style="width:67%">${kat}</span> 
              <span class='kat-count'>0</span>
              <span style="width:21%">
                <button type='button' onclick='zmienKategorie(this, 1, ${val})'>+</button>
                <button type='button' onclick='zmienKategorie(this, -1, ${val})'>−</button>
              </span>
            </div>
          `;
        }).join("");

        const maszyny = {
          ST50: "Pion",
          ST30: "Przegub",
          ST10: "Krzyżak/Osłona"
        };
        const keyMachine = maszyny[key] || "Tulipan/CG";

        el.innerHTML = `
          <div class="wiersz-header">
            <label style="font-weight:800">⚙️${key}</label>
            <label style="font-weight:600">${keyMachine}</label>
            <input type="text" name="${indeks}_${key}" placeholder="Indeks wyrobu NOK" />
            <label><b>${val}szt</b> (Pozostało: <span class="left-count" data-st="${key}" data-indeks="${indeks}">${val}</span>)⛓️</label>
          </div>
          <div class="kategorie-przyciski" data-st="${key}" data-indeks="${indeks}" data-max="${val}">
            ${katHTML}
          </div>
        `;
        blok.appendChild(el);
      }
    }
  });

  document.getElementById("submit-button").addEventListener("click", () => {
    obsada = Array.from(document.querySelectorAll('.obsada-input'))
      .map(input => input.value.trim())
      .filter(val => val);

    kategorieMap = [
      "PC", "PL", "PP", "P/Y", "KC", "KL",
      "Przerwana kurtyna", "Uszkodzenie mech.", "Traceability SERVER", "Błąd hamulca BREAK", "Zazębienie NOK",
      "Waga smaru NOK", "Pozycja tłumika NOK", "Średnica wałka NOK", "Zablokowany pierścień",
      "Opaska NOK", "Osłonka NOK", "Rozsypane CG", "TC", "TL"
    ];

    kategorieMap.forEach((kat, idx) => {
      kategoriaDoKolumny[kat] = idx + 3; // kolumny od 4.
    });

    document.querySelectorAll('#braki-fields input').forEach(input => {
      const key = input.name.trim();
      const val = input.value.trim();
      if (val) brakiIndexMap[key] = val;
    });
    
    document.querySelectorAll('.kategorie-przyciski').forEach(container => {
      const indeks = container.dataset.indeks;
      const stacja = container.dataset.st;
      container.querySelectorAll('div').forEach(div => {
        const kategoria = div.querySelector('span')?.textContent?.trim();
        const ilosc = parseInt(div.querySelector('.kat-count')?.textContent || '0');
        if (ilosc > 0) {
          const klucz = `${indeks}_${stacja}_${kategoria}`;
          rozszerzoneKategorie[klucz] = ilosc;
        }
      });
    });

    const leftSpans = document.querySelectorAll('.left-count');
    const nierozdzielone = [...leftSpans].some(span => parseInt(span.textContent) > 0);
    if (nierozdzielone) {
      alert("Nie rozdzielono wszystkich braków na kategorie!");
      return; // opcjonalnie zatrzymuje dalsze działanie funkcji
    }
    document.getElementById("formularz-do-wyjebania").style.display = 'none';

    // Przezbrojenia - sumuj i wypisz
    const przezbrojeniaInputs = document.querySelectorAll('.przezbrojenia-row input');
    const sumaPrzezbrojenia = [...przezbrojeniaInputs].reduce((suma, input) => {
      const val = parseFloat(input.value);
      return suma + (!isNaN(val) ? val : 0);
    }, 0);
    const tekstPrzezbrojenia = [...przezbrojeniaInputs]
      .map(input => input.value.trim())
      .filter(v => v)
      .join(' + ');

    // Brak obsady - sumuj i wypisz nazwiska z minutami
    const brakObsadyContainer = document.querySelector('.brak-obsady-row');
    const brakObsadyInputs = brakObsadyContainer.querySelectorAll('input');
    let sumaBrakObsady = 0;
    const brakLista = [];
    for (let i = 0; i < brakObsadyInputs.length; i += 2) {
      const nazwisko = brakObsadyInputs[i]?.value.trim();
      const minuty = brakObsadyInputs[i + 1]?.value.trim();
      if (minuty) {
        if (nazwisko) brakLista.push(`${nazwisko} ${minuty}`);
        else brakLista.push(`${minuty}`);
        const val = parseFloat(minuty);
        if (!isNaN(val)) sumaBrakObsady += val;
      }
    }

    // Odpisy - minuty + odpis (i dodatkowa notatka jeśli istnieje)
    const odpisTbody = document.querySelector('#odpisy-table tbody');
    const odpisRows = odpisTbody.querySelectorAll('tr');
    const odpisDane = [];
    odpisRows.forEach(row => {
      const numberInput = row.querySelector('input[type="number"]');
      const select = row.querySelector('select');
      const textInput = select?.nextElementSibling;

      if (numberInput && select && textInput) {
        const minuty = numberInput.value.trim();
        const wybrany = select.options[select.selectedIndex]?.textContent.trim();
        const notatka = textInput.value.trim();
        const polaczenie = notatka ? `${wybrany} - ${notatka}` : wybrany;
        if (minuty && wybrany) odpisDane.push([`${minuty} min`, polaczenie]);
      }
    });

    // Wstaw dane do print-table-1
    const tabela1 = document.getElementById('print-table-1');
    const komorki = tabela1.querySelectorAll('thead tr td, thead tr th');
    komorki[4].innerHTML = `<input type="text" value="${tekstPrzezbrojenia}" />`;
    komorki[6].innerHTML = `<input type="text" value="${sumaPrzezbrojenia} min" />`;
    komorki[12].innerHTML = `<input type="text" value="${sumaBrakObsady} min" />`;
    komorki[10].innerHTML = `<input type="text" value="${brakLista.join(', ')}" />`;
    if (obsada[0] != undefined) komorki[5].innerHTML = `<input type="text" value="${obsada[0]}" />`;
    if (obsada[1] != undefined) komorki[7].innerHTML = `<input type="text" value="${obsada[1]}" />`;
    if (obsada[2] != undefined) komorki[8].innerHTML = `<input type="text" value="${obsada[2]}" />`;
    if (obsada[3] != undefined) komorki[11].innerHTML = `<input type="text" value="${obsada[3]}" />`;
    if (obsada[4] != undefined) komorki[13].innerHTML = `<input type="text" value="${obsada[4]}" />`;
    if (obsada[5] != undefined) komorki[14].innerHTML = `<input type="text" value="${obsada[5]}" />`;

    // Wstaw odpisy do istniejących 9 wierszy
    const tbody1 = tabela1.querySelector('tbody');
    const rows = tbody1.querySelectorAll('tr');
    for (let i = 0; i < 9; i++) {
      const row = rows[i];
      const minuty = odpisDane[i]?.[0] || '';
      const opis = odpisDane[i]?.[1] || '';
      if (row) {
        const inputs = row.querySelectorAll('input');
        if (inputs[0]) inputs[0].value = minuty;
        if (inputs[1]) inputs[1].value = opis;
      }
    }

    // Przepisz do print-table-2
    const teraz = new Date();
    const godzina = teraz.getHours();
    let data;
    let zmiana;
    if (godzina >= 6 && godzina < 14) zmiana = 'I';
    else if (godzina >= 14 && godzina < 22) zmiana = 'II';
    else zmiana = 'III';
    if (godzina < 6 && zmiana === 'III') {
      data = new Date(teraz);
      data.setDate(data.getDate() - 1);
    } else data = teraz;
    let dzien = data.toLocaleDateString('pl-PL');
    let linia = document.getElementById('linia').value;

    const tabela2 = document.getElementById('print-table-2');
    const wiersze2 = tabela2.querySelectorAll('tbody tr');
    let indexWiersza = 0;

    // 🔁 CZYŚCIMY WSZYSTKIE INPUTY
    const wszystkieInputy = tabela2.querySelectorAll('input');
    wszystkieInputy.forEach(input => {
      input.value = '';
    });

    const naglowekWiersz = tabela2.querySelectorAll('thead tr')[0];
    naglowekWiersz.children[0].querySelector('input').value = dzien;
    naglowekWiersz.children[1].querySelector('input').value = linia;
    naglowekWiersz.children[2].querySelector('input').value = zmiana;

    document.querySelectorAll("#table-body tr").forEach((row, i) => {
      const indeks = row.querySelector('td input')?.value || `Indeks ${i + 1}`;
      const iloscOK = row.querySelector('.sztuki')?.value || '';

      // Wiersz OK
      const rzadOK = wiersze2[indexWiersza];
      const komorkiOK = rzadOK?.querySelectorAll('td');
      if (!komorkiOK) return;
      komorkiOK[0].querySelector('input').value = indeks;
      komorkiOK[1].querySelector('input').value = iloscOK;
      komorkiOK[2].querySelector('input').value = iloscOK;
      indexWiersza++;

      // Pull Out
      const blokId = `blok-${indeks}`;
      const checkbox = document.querySelector(`#${CSS.escape(blokId)} input[type="checkbox"]`);
      const isPullOut = checkbox?.checked;
      if (isPullOut) {
        const rzadPullOut = wiersze2[indexWiersza];
        const komorkiPullOut = rzadPullOut?.querySelectorAll('td');
        if (!komorkiPullOut) return;
        komorkiPullOut[0].querySelector('input').value = `${indeks}.T`;
        komorkiPullOut[1].querySelector('input').value = '1';
        komorkiPullOut[2].querySelector('input').value = '-';
        indexWiersza++;
      }

      // Braki
      const braki = {
        ST50: parseInt(row.querySelector(".pion")?.value || 0),
        ST30: parseInt(row.querySelector(".przegub")?.value || 0),
        ST10: parseInt(row.querySelector(".krzyzak")?.value || 0),
        ST40: parseInt(row.querySelector(".tulipan")?.value || 0),
      };

      const nokKeys = {
        ST50: `${indeks}_ST50`,
        ST30: `${indeks}_ST30`,
        ST10: `${indeks}_ST10`,
        ST40: `${indeks}_ST40`,
      };

      for (const [stacja, ilosc] of Object.entries(braki)) {
        if (parseInt(ilosc) <= 0) continue;

        // Pobierz właściwą wartość braków z odpowiedniej klasy
        let iloscBrak = 0;
        switch (stacja) {
          case 'ST50':
            iloscBrak = row.querySelector('.brak.pion')?.value || ilosc;
            break;
          case 'ST30':
            iloscBrak = row.querySelector('.brak.przegub')?.value || ilosc;
            break;
          case 'ST10':
            iloscBrak = row.querySelector('.brak.krzyzak')?.value || ilosc;
            break;
          case 'ST40':
            iloscBrak = row.querySelector('.brak.tulipan')?.value || ilosc;
            break;
        }

        const override = brakiIndexMap[nokKeys[stacja]] || `${indeks}🚫${stacja}`;
        const rzadNOK = wiersze2[indexWiersza];
        const komorkiNOK = rzadNOK?.querySelectorAll('td');
        if (!komorkiNOK) continue;

        komorkiNOK[0].querySelector('input').value = override;
        komorkiNOK[1].querySelector('input').value = iloscBrak;
        komorkiNOK[2].querySelector('input').value = '-';

        // Kategorie rozszerzone
        for (const [klucz, wartosc] of Object.entries(rozszerzoneKategorie)) {
          const [indeksK, stacjaK, kategoria] = klucz.split('_');
          const kolumna = kategoriaDoKolumny[kategoria];
          if (
            indeksK === indeks &&
            stacjaK === stacja &&
            kolumna !== undefined &&
            komorkiNOK[kolumna]
          ) {
            komorkiNOK[kolumna].querySelector('input').value = wartosc;
          }
        }

        indexWiersza++;
      }
    });
    if (confirm("Czy chcesz dodać dane do bazy danych?")) {
      const sumaZrobiona = parseInt(document.getElementById('output').dataset.sumaZrobiona) || 0;
      const sumaWymagana = parseInt(document.getElementById('output').dataset.sumaWymagana) || 0;
      const pracaData = {linia, data, zmiana, zrobione: sumaZrobiona, wymagane: sumaWymagana};
      const odpisData = [];
      const produktData = [];
      const brakiData = [];
      odpisRows.forEach(row => {
        const minutyInput = row.querySelector('input[type="number"]');
        const OdpisSelect = row.querySelector('select');
        const notatkaInput = OdpisSelect?.nextElementSibling;
        const minuty = parseInt(minutyInput?.value || '');
        const odpis = OdpisSelect?.value || '';
        const notatka = notatkaInput?.value || '';
        if (minuty > 0 && odpis) {
          odpisData.push({
            minuty,
            odpis,
            notatka: notatka.trim()
          });
        }
      });
      if (sumaPrzezbrojenia != 0) {
        odpisData.push({
          minuty: sumaPrzezbrojenia,
          odpis: 'Przezbrojenia',
          notatka: ''
        });
      }
      if (sumaBrakObsady != 0) {
        odpisData.push({
          minuty: Math.round(0.25 * sumaBrakObsady),
          odpis: 'Brak obsady',
          notatka: ''
        });
      }
      document.querySelectorAll("#table-body tr").forEach(column => {
        const indeksInput = column.querySelector('input[placeholder="Numer indeksu"]');
        const iloscOKInput = column.querySelector('.sztuki');
        const iloscNOKText = column.querySelector('.suma-brakow');
        const indeks = indeksInput?.value?.trim();
        const ilosc_ok = parseInt(iloscOKInput?.value || 0);
        const ilosc_nok = iloscNOKText ? parseInt(iloscNOKText.textContent.trim(), 10) : 0;
        if (indeks != '') {
          produktData.push({
            indeks,
            ilosc_ok,
            ilosc_nok
          });
        }
      });
      document.querySelectorAll(".blok-indeksu").forEach(blok => {
        const indeksNaglowek = blok.querySelector(".naglowek-indeksu");
        const indeks = indeksNaglowek?.querySelector("b")?.textContent.trim();
        const pullOut = indeksNaglowek?.querySelector("input[type='checkbox']");
        if (pullOut.checked) {
          brakiData.push({
            produkt_indeks: indeks,
            stacja: '',
            kategoria: 'Pull Out',
            ilosc: 1
          });
        }
        blok.querySelectorAll(".brak-wiersz").forEach(wiersz => {
          const label = wiersz.querySelector(".wiersz-header label[style*='font-weight:800']");
          const stacja = label?.textContent.replace('⚙️', '').trim();
          wiersz.querySelectorAll(".rodzajBraku").forEach(katDiv => {
            const kat = katDiv.querySelectorAll("span")[0]?.textContent.trim();
            const ilosc = parseInt(katDiv.querySelector(".kat-count")?.textContent || "0");
            if (ilosc > 0 && stacja && kat) {
              brakiData.push({
                produkt_indeks: indeks,
                stacja,
                kategoria: kat,
                ilosc
              });
            }
          });
        });
      });
      zapiszDoBazy(pracaData, obsada, odpisData, produktData, brakiData);
    }

    document.getElementById("tabelki").style.display = 'block';

  });

  requestAnimationFrame(() => { modal.classList.add('show') });
  setTimeout(() => {
    klikPozaModal = function (e) {
      if (!content.contains(e.target)) {
        zamknijModal();
      }
    };
    document.addEventListener('click', klikPozaModal);
  }, 50);
  
  document.addEventListener('keydown', escListener);
  function escListener(e) {
    if (e.key === 'Escape') {
      zamknijModal();
    }
  }
}

function dodajPoleObsady() {
  const container = document.getElementById("obsada-box");
  const btn = document.getElementById("dodaj-osobe-btn");
  if (!container || !btn) return;

  const currentInputs = container.querySelectorAll("input.obsada-input").length;

  if (currentInputs >= 6) return;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Nazwisko i Imię";
  input.className = "obsada-input";
  container.insertBefore(input, btn);

  if (container.querySelectorAll("input.obsada-input").length >= 6) {
    btn.style.display = "none";
  }
}

function zmienKategorie(btn, delta, max) {
  const container = btn.closest('.kategorie-przyciski');
  const sum = [...container.querySelectorAll(".kat-count")]
    .map(span => parseInt(span.textContent)).reduce((a, b) => a + b, 0);

  const rowDiv = btn.closest('.rodzajBraku');
  const span = rowDiv.querySelector(".kat-count");
  let val = parseInt(span.textContent) || 0;

  if (delta === 1 && sum < max) val++;
  if (delta === -1 && val > 0) val--;
  span.textContent = val;

  // 🔁 Aktualizacja licznika "Pozostało"
  const st = container.dataset.st;
  const indeks = container.dataset.indeks;
  const leftElem = document.querySelector(`.left-count[data-st="${st}"][data-indeks="${indeks}"]`);
  if (leftElem) {
    const nowaSuma = [...container.querySelectorAll(".kat-count")]
      .map(s => parseInt(s.textContent)).reduce((a, b) => a + b, 0);
    leftElem.textContent = max - nowaSuma;
  }

  // 🎞️ Animacja po kliknięciu
  rowDiv.style.transition = 'transform 0.15s ease';
  rowDiv.style.transform = 'scaleX(0.98)';
  setTimeout(() => {
    rowDiv.style.transform = 'scaleX(1)';
  }, 100);
}

async function zapiszDoBazy(pracaData, obsada, odpisData, produktData, brakiData) {
  const supabaseURL = 'https://zmbentfvctwxbdhkfatq.supabase.co/rest/v1';
  const headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptYmVudGZ2Y3R3eGJkaGtmYXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjczNjYsImV4cCI6MjA2ODYwMzM2Nn0.jtMLtEmhS8thmUotuj6i3PtBxqKBRJJ98wp9AsRyx1c',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptYmVudGZ2Y3R3eGJkaGtmYXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjczNjYsImV4cCI6MjA2ODYwMzM2Nn0.jtMLtEmhS8thmUotuj6i3PtBxqKBRJJ98wp9AsRyx1c',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    // 1️⃣ Zapis do tabeli `praca`
    const resPraca = await fetch(`${supabaseURL}/praca`, {
      method: 'POST',
      headers,
      body: JSON.stringify(pracaData)
    });

    if (!resPraca.ok) throw new Error("❌ Błąd zapisu do tabeli 'praca'");

    const [rekordPraca] = await resPraca.json();
    const praca_id = rekordPraca.id;
    console.log("✅ Zapisano do PRACA:", rekordPraca);

    // 2️⃣ Zapis do tabeli `obsada`
    if (obsada.length > 0) {
      const daneObsada = obsada.map(nazwisko => ({
        nazwisko,
        praca_id
      }));

      const resObsada = await fetch(`${supabaseURL}/obsada`, {
        method: 'POST',
        headers,
        body: JSON.stringify(daneObsada)
      });

      if (!resObsada.ok) throw new Error("❌ Błąd zapisu do tabeli 'obsada'");
      const wynikObsada = await resObsada.json();
      console.log("✅ Zapisano do OBSADA:", wynikObsada);
    }

    // 3️⃣ Zapis do tabeli `przestoje`
    if (odpisData.length > 0) {
      const danePrzestoje = odpisData.map(item => ({
        ...item,
        praca_id
      }));

      const resPrzestoje = await fetch(`${supabaseURL}/przestoje`, {
        method: 'POST',
        headers,
        body: JSON.stringify(danePrzestoje)
      });

      if (!resPrzestoje.ok) throw new Error("❌ Błąd zapisu do tabeli 'przestoje'");
      console.log("✅ Zapisano do PRZESTOJE:", await resPrzestoje.json());
    }

    // 4️⃣ Zapis do tabeli `produkt`
    let zapisaneProdukty = [];

    if (produktData.length > 0) {
      const daneProdukt = produktData.map(p => ({
        indeks: p.indeks,
        ilosc_ok: p.ilosc_ok || 0,
        ilosc_nok: p.ilosc_nok || 0,
        praca_id
      }));

      const resProdukt = await fetch(`${supabaseURL}/produkt`, {
        method: 'POST',
        headers,
        body: JSON.stringify(daneProdukt)
      });

      if (!resProdukt.ok) throw new Error("❌ Błąd zapisu do tabeli 'produkt'");

      zapisaneProdukty = await resProdukt.json();
      console.log("✅ Zapisano do PRODUKT:", zapisaneProdukty);
    }

    // 5️⃣ Zapis do tabeli `braki` — po uzyskaniu produkt_id
    if (zapisaneProdukty.length > 0 && brakiData.length > 0) {
      const daneBraki = [];

      zapisaneProdukty.forEach(prod => {
        const pasujaceBraki = brakiData.filter(b => b.produkt_indeks === prod.indeks);
        pasujaceBraki.forEach(b => {
          daneBraki.push({
            produkt_id: prod.id,
            stacja: b.stacja,
            kategoria: b.kategoria,
            ilosc: b.ilosc
          });
        });
      });

      if (daneBraki.length > 0) {
        const resBraki = await fetch(`${supabaseURL}/braki`, {
          method: 'POST',
          headers,
          body: JSON.stringify(daneBraki)
        });

        if (!resBraki.ok) throw new Error("❌ Błąd zapisu do tabeli 'braki'");
        console.log("✅ Zapisano do BRAKI:", await resBraki.json());
      }
    }

    alert("✅ Zapisano dane do bazy!");

  } catch (err) {
    console.error("❌ Błąd podczas zapisu:", err);
    alert("❌ Błąd zapisu do bazy:\n" + err.message);
  }
}
