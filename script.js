const useBinarySearchAlgorithm = (min, max) => Math.floor((min + max) / 2); // - алгоритм бинарного поиска
const getRandomNumber = (min, max) => Math.floor(min + Math.random() * (max + 1 - min)); // - случайное число
const fixRangeValues = (value) => (value = value < -999 ? -999 : value > 999 ? 999 : value); // - задаёт интервал
let minValue, maxValue, gameReady, attemptCount, answerValue; // - мин.и макс. значения, статус игры, кол-во попыток
const gameOverPhraseValues = [
    'Я всегда угадываю!\n\u{1F60E}',
    'Это моя суперспособность!\n\u{1F9B8}',
    'Сыграем заново? Я опять угадаю!\n\u{1F60E}',
    'Это было не сложно!\n\u{1F60A}',
    'Как я это делаю?\n\u{1F914} <br> - С помощью алгоритма бинарного поиска!'
];
const failedPhraseValues = [
    'Вы загадали неправильное число!\n\u{1F914}',
    'Меня терзают смутные сомнения!\n\u{1F928}',
    'Вы не соблюдаете правила игры!\n\u{1F620}',
    'Вы забыли какое число загадали?\n\u{1F609}',
    'Вам просто нравится нажимать на кнопки?\n\u{1F609}'
];

document.addEventListener('DOMContentLoaded', () => {
    setDefaultSettings(); // - Устанавливаем значения игры по умолчанию
    getRangeValues(); // - Получаем значения от пользователя и проверяем их
});
/* --- Кнопка Заново --- - сбрасываем настройки по умолчанию --- */
document.querySelector('.form__close-btn').addEventListener('click', setDefaultSettings);
document.querySelector('.game__btn_refresh').addEventListener('click', setDefaultSettings);
// --- Кнопка Начать игру --- начинаем игру, закрываем модальное окно
document.querySelector('.form__btn').addEventListener('click', () => {
    if (gameReady) {
        const popup = document.querySelector('.game-start');
        popup.classList.remove('show'); // - закрываем модальное окно, начинаем игру
        minValue = minValue < -999 ? -999 : minValue > 999 ? 999 : minValue;
        maxValue = maxValue < -999 ? -999 : maxValue > 999 ? 999 : maxValue;
        answerValue = useBinarySearchAlgorithm(minValue, maxValue);
        displayAnswerValue(answerValue); // отображаем предполанаемый ответ
    }
});
// --- Кнопка Больше --- - предлагает следующиё вариант
document.querySelector('.game__btn_more').addEventListener('click', () => {
    if (gameReady) showNextAnswer('more');
});
// --- Кнопка Меньше --- - предлагает следующиё вариант
document.querySelector('.game__btn_less').addEventListener('click', () => {
    if (gameReady) showNextAnswer('less');
});
// --- Кнопка Верно --- -конец игры
document.querySelector('.game__btn_confirm').addEventListener('click', () => {
    if (gameReady) displayAnswerText(gameOverPhraseValues);
    gameReady = false;
});

// показываем модальное окно с формой для получения min и max значений
function showModal() {
    const popup = document.querySelector('.game-start');
    if (popup) popup.classList.add('show');
}
// устанавливаем значения игры по умолчанию
function setDefaultSettings() {
    showModal();
    const minValueField = document.querySelector('#min-value');
    const maxValueField = document.querySelector('#max-value');
    gameReady = false;
    minValueField.value = '';
    maxValueField.value = '';
    minValue = 0; // - мин. значение по умолчанию
    maxValue = 100; // - макс. значение по умолчанию
    displayHintText(minValue, maxValue, minValueField, maxValueField); // - отображаем текст подсказки
    attemptCount = 1; // - количество попыток по умолчанию = 1
    answerValue = useBinarySearchAlgorithm(minValue, maxValue); // - вычисляем с помощью алгоритма значение
    displayAnswerValue(answerValue); // - Отображаем текст с предполагаемым вычеслинным вариантом ответа
    displayAttemptValue(attemptCount); // - Отображаем текущее кол-во попыток;
}
// - запрашиваем значения минимума и максимума
function getRangeValues() {
    const minValueField = document.querySelector('#min-value'); // - поле ввода мин. значения
    minValueField.addEventListener('input', () => {
        if (minValueField.value !== '') {
            minValue = parseInt(minValueField.value);
            if (!isNaN(minValue)) {
                minValue = fixRangeValues(minValue);
                displayHintText(minValue, maxValue, minValueField, minValueField);
                gameReady = isNaN(minValue) || isNaN(maxValue) || minValue > maxValue ? false : true;
            }
        }
    });

    const maxValueField = document.querySelector('#max-value'); // - поле ввода макс. значения
    maxValueField.addEventListener('input', () => {
        if (maxValueField.value !== '') {
            maxValue = parseInt(maxValueField.value);
            if (!isNaN(maxValue)) {
                maxValue = fixRangeValues(maxValue);
                displayHintText(minValue, maxValue, maxValueField, minValueField);
                gameReady = isNaN(minValue) || isNaN(maxValue) || minValue > maxValue ? false : true;
            }
        }
    });
}
// отображаем подсказки пользователю в зависимости от вводимых данных
function displayHintText(min, max, inputField, inputMinField) {
    const hint = document.querySelector('.form__text'); // - подсказка пользователю при вводе значений
    if (!isNaN(min) && !isNaN(max)) {
        hint.innerHTML = `Загадайте любое целое число <br> от 
				<span class="min-value">${min}</span> до
				<span class="max-value">${max}</span>, а я его угадаю`;
        inputField.classList.remove('error');
        if (min > max) {
            hint.innerHTML = `Значение мин.:<span class="min-value">${min}</span> 
				не должно больше макс.: <span class="max-value">${max}</span>`;
            inputMinField.classList.add('error');
        } else {
            inputMinField.classList.remove('error');
        }
    } else {
        hint.innerHTML = 'Проверьте вводимые значения, допустимы только целые числа';
        inputField.classList.add('error');
    }
}
// показывает номер текущей попытки отгадать задуманное число
function displayAttemptValue(count) {
    const attemptCountField = document.querySelector('.counter'); // - счетчик попыток
    attemptCountField.textContent = count; // - отображаем текущее кол-во попыток
}
// показывает пользователю сообщения в ходе игры
function displayAnswerText(array) {
    const randomNumber = getRandomNumber(0, 4);
    const answerOutput = document.querySelector('.game__answer'); // - фразы ответа целиком
    answerOutput.innerHTML = array[randomNumber];
}
// генерирует случайные фразы с предполагаемым вариантом ответа
function displayAnswerValue(currentValue) {
    const randomNumber = getRandomNumber(0, 4);
    const answerOutput = document.querySelector('.game__answer'); // - фразы ответа целиком
    const answerPhraseValues = [
        `Вы загадали число <span class="answer">${currentValue}</span> ?`,
        `Да это легко! \u{1F60E} Вы загадали число <span class="answer">${currentValue}</span> ?`,
        `Осмелюсь предположить, что это число <span class="answer">${currentValue}</span> ?`,
        `Я угадаю эту мелодию... Упс, \u{1F648}  не та игра... число <span class="answer">${currentValue}</span> ?`,
        `Никаких догадок \u{1F609}, только алгоритмы! \u{1F4AA} число <span class="answer">${currentValue}</span> ?`
    ];
    answerOutput.innerHTML = answerPhraseValues[randomNumber];
}
// показывает следующий вариант ответа
function showNextAnswer(btn) {
    if (minValue === maxValue) {
        gameReady = false;
        displayAnswerText(failedPhraseValues);
    } else {
        btn === 'less' ? (maxValue = answerValue - 1) : (minValue = answerValue + 1);
        answerValue = useBinarySearchAlgorithm(minValue, maxValue);
        attemptCount++;
        displayAttemptValue(attemptCount);
        displayAnswerValue(answerValue);
    }
}
