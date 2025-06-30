const normaSelect = document.getElementById('norma');
const tableBody = document.getElementById('table-body');
const output = document.getElementById('output');
const addRowBtn = document.getElementById('add-row');

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
      if (th.dataset.short) {
        th.innerHTML = th.dataset.short;
      } else {
        // Jeśli brak data-short, pokaż oryginał
        th.innerHTML = th.dataset.full;
      }
    } else {
      th.innerHTML = th.dataset.full;
    }
  });
}

window.addEventListener('DOMContentLoaded', updateTableHeaders);
window.addEventListener('resize', updateTableHeaders);

// Dodaje nowe pole do przezbrojeń
function addPrzezbrojenie() {
  const container = document.querySelector('.przezbrojenia-row');
  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'numeric-input';
  input.min = '10';
  input.step = '5';
  inputNumber.placeholder = 'Minuty';
  container.insertBefore(input, container.lastElementChild); // przed przyciskiem +
}

// Dodaje nową parę inputów do braku obsady
function addBrakObsady() {
  const container = document.querySelector('.brak-obsady-row');
  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.placeholder = 'Pracownik';

  const inputNumber = document.createElement('input');
  inputNumber.type = 'number';
  inputNumber.className = 'numeric-input';
  inputNumber.min = '15';
  inputNumber.step = '5';
  inputNumber.placeholder = 'Minuty';

  container.insertBefore(inputText, container.lastElementChild);
  container.insertBefore(inputNumber, container.lastElementChild);
}

// Dodaje nowy wiersz odpisu (liczba + tekst)
function addOdpis() {
  const table = document.getElementById('odpisy-table');
  const row = document.createElement('tr');

  const td = document.createElement('td');
  td.colSpan = 2;

  const inputNumber = document.createElement('input');
  inputNumber.type = 'number';
  inputNumber.className = 'numeric-input';
  inputNumber.min = '10';
  inputNumber.step = '5';
  inputNumber.placeholder = 'Minuty';
  inputNumber.style.width = '8%';

  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.placeholder = 'Opisz co się wydarzyło przez ten czas...';
  inputText.style.width = '90%';
  inputText.style.marginLeft = '10px';

  td.appendChild(inputNumber);
  td.appendChild(inputText);
  row.appendChild(td);

  table.querySelector('tbody').appendChild(row);
}

function utworzWiersz(index = '') {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" placeholder="Numer indeksu" value="${index}" /></td>
    <td><input type="number" class="sztuki" value="0" min="0" /></td>
    <td class="suma-brakow">0</td>
    <td><input type="number" class="brak krzyzak" value="0" min="0" /></td>
    <td><input type="number" class="brak przegub" value="0" min="0" /></td>
    <td><input type="number" class="brak tulipan" value="0" min="0" /></td>
    <td><input type="number" class="brak pion" value="0" min="0" /></td>
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

  // 1. Oblicz błędy ważone ze wszystkich rzędów danych
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

  // 2. Oblicz dodatkowe minuty odpisów
  let sumaOdpisowMinuty = 0;
  const odpisInputs = document.querySelectorAll('.numeric-input');
  odpisInputs.forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) {
      sumaOdpisowMinuty += val;
    }
  });

  const sztukiDoOdjeciaZaOdpisy = sumaOdpisowMinuty * 1.3;

  // 3. Oblicz całkowitą wymaganą ilość
  const norma = parseInt(normaSelect.value);
  sumaWymagana = norma - sumaWazonaBrakow - sztukiDoOdjeciaZaOdpisy;

  // 4. Wyświetlenie komunikatu
  if (sumaZrobiona < sumaWymagana) {
    output.textContent = `Powinieneś zrobić ${Math.round(sumaWymagana)} zamiast ${sumaZrobiona}!`;
    output.style.color = 'crimson';
  } else {
    output.textContent = `Zrobione: ${sumaZrobiona}, wymagane: ${Math.round(sumaWymagana)}.`;
    output.style.color = 'green';
  }
}

addRowBtn.addEventListener('click', () => utworzWiersz(''));

document.addEventListener('change', aktualizuj);

addOdpis();
utworzWiersz();
