const STORAGE_KEY = 'horse-feed';
const LEAD_DAYS = 5;

function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

const products = loadProducts();

function todayString() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + month + '-' + day;
}

function dayNumber(dateString) {
  return Math.round(Date.parse(dateString) / 86400000);
}

function formatDay(dayNum) {
  return new Date(dayNum * 86400000).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

function calcStock(product) {
  const today = dayNumber(todayString());
  const daysPassed = today - dayNumber(product.stockDate);
  const remainingG = Math.max(0, product.stockG - product.dailyG * daysPassed);
  const daysLeft = Math.floor(remainingG / product.dailyG);
  const runOutDay = today + daysLeft;
  return {
    remainingG: remainingG,
    daysLeft: daysLeft,
    runOutDay: runOutDay,
    orderByDay: runOutDay - LEAD_DAYS,
  };
}

function buyMore(index) {
  const packs = Number(prompt('Ile opakowań kupiłaś?'));
  if (!(packs > 0)) return;

  const product = products[index];
  product.stockG = calcStock(product).remainingG + packs * product.packG;
  product.stockDate = todayString();
  saveProducts();
  renderProducts();
}

function editDaily(index) {
  const newDailyG = Number(prompt('Ile gramów dziennie zjada koń?'));
  if (!(newDailyG > 0)) return;

  const product = products[index];
  product.stockG = calcStock(product).remainingG;
  product.stockDate = todayString();
  product.dailyG = newDailyG;
  saveProducts();
  renderProducts();
}

function removeProduct(index) {
  const product = products[index];
  if (!confirm('Usunąć paszę „' + product.name + '"?')) return;

  products.splice(index, 1);
  saveProducts();
  renderProducts();
}

function makeButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function renderProducts() {
  const list = document.getElementById('list');
  const alertBox = document.getElementById('alert');
  list.innerHTML = '';
  const low = [];

  products.forEach(function (product, index) {
    const stock = calcStock(product);
    const isLow = stock.daysLeft <= LEAD_DAYS;
    if (isLow) low.push(product.name);

    const item = document.createElement('li');
    if (isLow) item.classList.add('order');

    const text = document.createElement('span');

    const name = document.createElement('strong');
    name.textContent = product.name;

    const details = document.createTextNode(
      ': zostało ' + stock.remainingG +
      ' g, zużycie ' + product.dailyG + ' g dziennie, starczy na ' + stock.daysLeft +
      ' dni (do ' + formatDay(stock.runOutDay) + '). ' +
      (isLow ? 'Zamów teraz! ' : 'Zamów do ' + formatDay(stock.orderByDay) + '. ')
    );

    text.appendChild(name);
    text.appendChild(details);
    item.appendChild(text);

    const bar = document.createElement('div');
    bar.className = 'bar';
    const fill = document.createElement('div');
    fill.className = 'fill';
    fill.style.width = Math.min(100, (stock.daysLeft / 30) * 100) + '%';
    bar.appendChild(fill);
    item.appendChild(bar);

    item.appendChild(makeButton('Kupiłam', function () { buyMore(index); }));
    item.appendChild(makeButton('Zmień zużycie', function () { editDaily(index); }));
    item.appendChild(makeButton('Usuń', function () { removeProduct(index); }));

    list.appendChild(item);
  });

  alertBox.textContent = low.length ? 'Czas zamówić: ' + low.join(', ') : '';
}

const form = document.getElementById('add-form');
const message = document.getElementById('message');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const packG = Number(document.getElementById('pack-g').value);
  const packs = Number(document.getElementById('packs').value);
  const dailyG = Number(document.getElementById('daily-g').value);

  if (!name.trim() || !(packG > 0) || !(packs > 0) || !(dailyG > 0)) {
    message.textContent = 'Uzupełnij wszystkie pola, liczby muszą być większe od 0.';
    return;
  }
  message.textContent = '';

  products.push({
    name: name.trim(),
    packG: packG,
    dailyG: dailyG,
    stockG: packG * packs,
    stockDate: todayString(),
  });
  saveProducts();
  renderProducts();
  form.reset();
});

renderProducts();