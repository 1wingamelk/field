const GRID_SIZE = { rows: 6, cols: 3 };
const MULTIPLIERS = [1.44, 2.16, 3.24, 4.86, 7.29, 10.94]; // От нижнего ряда к верхнему
const DEFAULT_BET = 100.00;
let currentBalance = 1000.00; // Начальный баланс
let currentBet = DEFAULT_BET;
let gameActive = false;
let currentRow = 0; // Текущий ряд, в котором выбираем ячейку
let currentMultiplier = 1.0;
let winAmount = 0.0;
// ... (остальные переменные)
const gameStats = {
    demoBalance: 99488.00,
    currentBet: 100.00,
    currentWin: 0.00 // Текущий потенциальный выигрыш
};
// ...
function handleCellClick(clickedCell) {
    if (!gameActive || clickedCell.classList.contains('opened')) return;
    
    // 1. Пометить выбранную ячейку как 'safe'
    clickedCell.classList.add('opened');
    
    // 2. Определить оставшиеся ячейки в ряду
    const rowElement = clickedCell.closest('.grid-row');
    const allCellsInRow = Array.from(rowElement.querySelectorAll('.cell'));
    const remainingCells = allCellsInRow.filter(cell => cell !== clickedCell);
    
    // 3. Выбрать одну из оставшихся ячеек для флага (мины)
    const mineIndex = Math.floor(Math.random() * remainingCells.length);
    const mineCell = remainingCells[mineIndex];
    mineCell.classList.add('mine-flag');
    
    // 4. Обновление множителя и потенциального выигрыша
    const multiplier = parseFloat(rowElement.dataset.multiplier);
    currentMultiplier = multiplier;
    gameStats.currentWin = gameStats.currentBet * currentMultiplier; // Обновляем потенциальный выигрыш
    
    // 5. Перейти к следующему ряду
    currentRow++;
    
    // 6. Обновить UI (множители, выигрыш и т.д.)
    updateUI();
    
    // 7. Проверка, если игра не окончена, то активируем следующий ряд
    if (currentRow < GRID_SIZE.rows) {
        document.querySelector(`.grid-row[data-row="${currentRow}"]`).classList.add('active');
    } else {
        // Достигнут последний ряд, автоматический Cashout
        cashOut();
    }
}
function cashOut() {
    if (!gameActive) return;

    gameActive = false;
    
    const finalWin = gameStats.currentWin;
    gameStats.demoBalance += finalWin;

    // 1. Показать анимацию победы
    showWinAnimation(finalWin);

    // 2. Сбросить состояние игры/кнопок
    document.getElementById('btn-cashout').classList.add('hidden');
    document.getElementById('btn-start-play').classList.remove('hidden');
    
    // 3. Сбросить счетчики
    gameStats.currentWin = 0.00;
    currentRow = 0;
    
    // 4. Обновить UI
    updateUI();
    
    // 5. Очистить поле (если нужно)
    setTimeout(clearGrid, 1500); // Очистка после анимации
}

function showWinAnimation(amount) {
    const winElement = document.getElementById('win-animation');
    // Форматирование суммы без слова 'WIN'
    document.getElementById('win-amount').textContent = `DEMO ${amount.toFixed(2).replace('.', ',')}`;
    
    winElement.classList.add('visible');
    
    // Скрытие анимации
    setTimeout(() => {
        winElement.classList.remove('visible');
    }, 1500);
}

function updateUI() {
    // Обновление нижнего блока статистики
    document.getElementById('demo-balance-current').textContent = `DEMO ${gameStats.demoBalance.toFixed(2).replace('.', ',')}`;
    
    // Обновление потенциального выигрыша в нижнем блоке
    document.getElementById('demo-win-amount').textContent = `WIN DEMO ${gameStats.currentWin.toFixed(2).replace('.', ',')}`;
    
    // Управление кнопками и активными рядами...
}
