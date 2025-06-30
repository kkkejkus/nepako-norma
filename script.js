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

window.addEventListener('DOMContentLoaded', updateTableHeaders);
window.addEventListener('resize', updateTableHeaders);

function dodajPrzezbrojenie() {
  const container = document.querySelector('.przezbrojenia-row');
  const inputs = container.querySelectorAll('input[type="number"]');
  if (inputs.length >= 8) return; // max 8

  const input = document.createElement('input');
  input.type = 'number';
  input.className = 'numeric-input';
  input.min = '10';
  input.step = '5';
  input.placeholder = 'Minuty';

  input.addEventListener('input', aktualizuj);
  container.lastElementChild.after(input);
}

function dodajBrakObsady() {
  const container = document.querySelector('.brak-obsady-row');
  const inputs = container.querySelectorAll('input[type="number"]');
  if (inputs.length >= 4) return; // max 4

  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.placeholder = 'Pracownik';

  const inputNumber = document.createElement('input');
  inputNumber.type = 'number';
  inputNumber.className = 'numeric-input';
  inputNumber.min = '15';
  inputNumber.step = '5';
  inputNumber.placeholder = 'Minuty';

  inputNumber.addEventListener('input', aktualizuj);

  container.lastElementChild.after(inputText);
  inputText.after(inputNumber);
}

function dodajOdpis() {
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
  inputText.placeholder = 'Opisz co wydarzyło się przez ten czas...';
  inputText.style.width = '90%';
  inputText.style.marginLeft = '10px';

  td.appendChild(inputNumber);
  td.appendChild(inputText);
  row.appendChild(td);

  table.querySelector('tbody').appendChild(row);
}

function dodajIndex(index = '') {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" placeholder="Numer indeksu" value="${index}" /></td>
    <td>
      <select class="warstwa-select">
        <option value="6">6</option>
        <option value="8" selected>8</option>
        <option value="9">9</option>
      </select>
    </td>
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


  document.querySelectorAll('.warstwa-select').forEach(select => {
    function ustawKolor() {
      const val = select.value;
      let kolor = {
        '6': '#acacac',
        '8': '#0f7431',
        '9': '#b41780'
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
  document.querySelectorAll('.przezbrojenia-row input').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) sumaPrzezbrojenia += val;
  });
  document.getElementById('suma-przezbrojenia').textContent = `Łącznie: ${sumaPrzezbrojenia}min`;

  // Suma braków obsady
  let sumaBrakObsady = 0;
  document.querySelectorAll('.brak-obsady-row input[type="number"]').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) sumaBrakObsady += val;
  });
  document.getElementById('suma-brak-obsady').textContent = `Łącznie: ${sumaBrakObsady}min`;

  // Suma wszystkich odpisów (w tym przezbrojeń i braków obsady)
  let sumaOdpisowMinuty = 0;
  document.querySelectorAll('.numeric-input').forEach(input => {
    const val = parseFloat(input.value);
    if (!isNaN(val)) sumaOdpisowMinuty += val;
  });

  const sztukiDoOdjeciaZaOdpisy = sumaOdpisowMinuty * 1.3;
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
