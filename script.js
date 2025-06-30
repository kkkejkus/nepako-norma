const normaSelect = document.getElementById('norma');
const tableBody = document.getElementById('table-body');
const output = document.getElementById('output');

// Wagi dla poszczególnych kolumn braków
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
    if (!th.dataset.full) {
      th.dataset.full = th.innerHTML;
    }

    if (windowWidth < 900) {
      th.innerHTML = th.dataset.short || th.dataset.full;
    } else {
      th.innerHTML = th.dataset.full;
    }
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
      // usuwamy klasę nbb i padding z TD ostatniego TR
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
  if (inputs.length >= 8) return; // max 8

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
  inputText.after(inputNumber);
}

function dodajOdpis() {
  const table = document.getElementById('odpisy-table');
  const tbody = table.querySelector('tbody');
  const row = document.createElement('tr');
  const td = document.createElement('td');
  td.colSpan = 2;
  td.className = 'nbt';
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
    <select class="odpis-select" style="width: 22%; margin-left: -6px; border-radius: 0">
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
      placeholder="Dodatkowy opis..." 
      style="width: 70%; margin-left: -6px" 
    />
    <span class="bin" onclick="usunWiersz(event)">🗑️</span>
    </div>
  `;
  row.appendChild(td);

  const newSelect = td.querySelector('select.odpis-select');
  const updateColor = () => {
    const selectedOption = newSelect.options[newSelect.selectedIndex];
    if (selectedOption.disabled && selectedOption.selected) {
      newSelect.classList.add('placeholder');
    } else {
      newSelect.classList.remove('placeholder');
    }
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

function dodajKlikUsuwaniaWiersza(tr) {
  const komorki = tr.querySelectorAll('td');

  komorki.forEach(td => {
    td.addEventListener('click', e => {
      // Jeśli kliknięto w komórkę, ale nie w input
      if (e.target.tagName !== 'INPUT') {
        tr.remove();
        aktualizuj();
      }
    });
  });
}

function dodajIndex(index = '') {
  const ostatniWiersz = tableBody.lastElementChild;
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

  // Suma przezbrojeń
  let sumaPrzezbrojenia = 0;
  let sumaSztPrzezbrojenia = 0;
  document.querySelectorAll('.przezbrojenia-row input').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) sumaPrzezbrojenia += val;
  });
  sumaSztPrzezbrojenia = Math.floor(sumaPrzezbrojenia * 1.3);
  document.getElementById('suma-przezbrojenia').textContent = `${sumaPrzezbrojenia}min | -${sumaSztPrzezbrojenia}szt`;

  // Suma braków obsady
  let sumaBrakObsady = 0;
  let sumaSztBrakObsady = 0;
  document.querySelectorAll('.brak-obsady-row input[type="number"]').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) sumaBrakObsady += val;
  });
  sumaSztBrakObsady = Math.round(sumaBrakObsady * 1.3 * 0.25);
  document.getElementById('suma-brak-obsady').textContent = `${sumaBrakObsady}min | -${sumaSztBrakObsady}szt`;

  // Suma wszystkich odpisów (w tym przezbrojeń i braków obsady)
  let sumaOdpisowMinuty = 0;
  const odpisInputs = document.querySelectorAll('.numeric-input');
  odpisInputs.forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) {
      if (input.classList.contains('brak-obsady')) {
        sumaOdpisowMinuty += val * 0.25;
      } else {
        sumaOdpisowMinuty += val;
      }
    }
  });

  const sztukiDoOdjeciaZaOdpisy = sumaOdpisowMinuty * 1.3;
  document.getElementById('suma-odpisy').textContent = `${sumaOdpisowMinuty}min | -${Math.round(sztukiDoOdjeciaZaOdpisy)}szt`;

  const norma = parseInt(normaSelect.value);
  sumaWymagana = norma - sumaWazonaBrakow - sztukiDoOdjeciaZaOdpisy;

  const warning = document.getElementById('warning');
  warning.textContent = ''; // czyścimy wcześniej

  if (sumaZrobiona < sumaWymagana) {
    const wymagana = Math.round(sumaWymagana);
    const naWarstweInputs = document.querySelectorAll('.warstwa-select');
    const naWarstwe = parseInt(naWarstweInputs[naWarstweInputs.length - 1]?.value) || 1;

    let dol, gora;

    if (wymagana % naWarstwe === 0) {
      gora = wymagana;
      dol = wymagana - naWarstwe;
    } else {
      dol = wymagana - (wymagana % naWarstwe);
      gora = dol + naWarstwe;
    }

    const roznica = wymagana - sumaZrobiona;
    const kolor = roznica <= 20 ? 'orange' : 'crimson';

    output.textContent = `Powinieneś zrobić ${wymagana} (± ${dol}/${gora}) zamiast ${sumaZrobiona}!`;
    output.style.color = kolor;
  } else {
    const wymagana = Math.round(sumaWymagana);
    const roznica = sumaZrobiona - wymagana;

    output.textContent = `Zrobione: ${sumaZrobiona}, wymagane: ${wymagana}.`;
    output.style.color = 'green';

    if (roznica > 10) {
      warning.textContent = 'Nie zawyżaj normy!!!';
      warning.style.color = 'orange';
      if (roznica > 20) {
        warning.style.color = 'crimson';
      }
    }
  }
}

document.addEventListener('change', aktualizuj);

window.addEventListener('DOMContentLoaded', () => {
  dodajOdpis();
  dodajIndex();
});
