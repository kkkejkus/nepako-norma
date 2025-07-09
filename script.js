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
    const naWarstwe = parseInt(naWarstweInputs[naWarstweInputs.length - 1]?.value) || 1;

    let dol, gora;

    if (sumaWymagana % naWarstwe === 0) {
      gora = sumaWymagana;
      dol = sumaWymagana - naWarstwe;
    } else {
      dol = sumaWymagana - (sumaWymagana % naWarstwe);
      gora = dol + naWarstwe;
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
}

function dodajPrintModal() {
  const modal = document.createElement('div');
  modal.id = 'print-modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div id="print-content">
      <div style="text-align: right; margin: -8px">
        <button id="print-button" class="plus" onclick="window.print()">🖨️</button>
        <button id="print-button" class="plus" onclick="zamknijModal()">❌</button>
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
            <th colspan="19">Braki</th>
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
            <th colspan="13" style="height:1px">Inne braki X</th>
          </tr>
          <tr>
            <th>Przer- wana kurtyna</th>
            <th>Uszko- dzenie mech.</th>
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
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
          <tr>${'<td><input type="text" /></td>'.repeat(22)}</tr>
        </tbody>
      </table>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('print-button').addEventListener('click', () => {
    modal.style.display = 'flex';
  });
}

document.addEventListener('change', aktualizuj);

window.addEventListener('DOMContentLoaded', () => {
  dodajOdpis();
  dodajIndex();
  dodajPrintModal();
  aktualizujDateGodzineIZmiane();
  setInterval(aktualizujDateGodzineIZmiane, 1000);
});

let klikPozaModal = null;

function zamknijModal() {
  const modal = document.getElementById('print-modal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 250);

  if (klikPozaModal) {
    document.removeEventListener('click', klikPozaModal);
    klikPozaModal = null;
  }
}

function otworzModal() {
  const modal = document.getElementById('print-modal');
  const content = document.getElementById('print-content');
  modal.style.display = 'flex';
  requestAnimationFrame(() => {
    modal.classList.add('show');
  });

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
    if (nazwisko && minuty) {
      brakLista.push(`${nazwisko} ${minuty}`);
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
  // Przezbrojenia
  komorki[4].innerHTML = `<input type="text" value="${tekstPrzezbrojenia}" />`;
  komorki[6].innerHTML = `<input type="text" value="${sumaPrzezbrojenia} min" />`;
  // Brak obsady (suma minut w td rowspan=3 pod th Brak obsady)
  komorki[12].innerHTML = `<input type="text" value="${sumaBrakObsady} min" />`;
  // Lista nazwisk + minut
  komorki[10].innerHTML = `<input type="text" value="${brakLista.join(', ')}" />`;

  // Wstaw odpisy do istniejących 9 wierszy (nie usuwaj tbody)
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
  const dzien = data.toLocaleDateString('pl-PL');
  let linia = document.getElementById('linia').value;

  const tabela2 = document.getElementById('print-table-2');
  const wiersze2 = tabela2.querySelectorAll('tbody tr');
  let indexWiersza = 0;

  // ustaw datę i zmianę
  const naglowekWiersz = tabela2.querySelectorAll('thead tr')[0];
  naglowekWiersz.children[0].querySelector('input').value = dzien;
  naglowekWiersz.children[1].querySelector('input').value = linia;
  naglowekWiersz.children[2].querySelector('input').value = zmiana;

  document.querySelectorAll('#table-body tr').forEach(row => {
    const indeks = row.querySelector('td input')?.value || '';
    const ilosc = row.querySelector('.sztuki')?.value || '';
    const braki = {
      ST10: row.querySelector('.krzyzak')?.value || 0,
      ST30: row.querySelector('.przegub')?.value || 0,
      ST50: row.querySelector('.pion')?.value || 0,
      ST40: row.querySelector('.tulipan')?.value || 0,
    };

    // główny wpis OK
    if (indexWiersza < wiersze2.length) {
      const tds = wiersze2[indexWiersza].querySelectorAll('td');
      tds[0].querySelector('input').value = indeks;
      tds[1].querySelector('input').value = ilosc;
      tds[2].querySelector('input').value = ilosc;
      indexWiersza++;
    }

    // osobne wpisy NOK
    for (const [key, val] of Object.entries(braki)) {
      if (parseInt(val) > 0 && indexWiersza < wiersze2.length) {
        const tds = wiersze2[indexWiersza].querySelectorAll('td');
        tds[0].querySelector('input').value = `NOK ${key}`;
        tds[1].querySelector('input').value = val;
        tds[2].querySelector('input').value = '-';
        indexWiersza++;
      }
    }
  });

  setTimeout(() => {
    klikPozaModal = function (e) {
      if (!content.contains(e.target)) {
        zamknijModal();
      }
    };
    document.addEventListener('click', klikPozaModal);
  }, 50);
}
