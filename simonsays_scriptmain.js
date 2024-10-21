document.addEventListener('DOMContentLoaded', () => {
    const yellowButton = document.getElementById('yellowButton');
    const redButton = document.getElementById('redButton');
    const greenButton = document.getElementById('greenButton');
    const blueButton = document.getElementById('blueButton');
    const goldenButton = document.getElementById('goldenButton');
    const trackTitle = document.getElementById('track-title');
    const artistName = document.getElementById('artist-name');

    let sequence = [];
    let playerSequence = [];
    let currentStep = 0;
    let isPlaying = false;

    // Загрузка данных из JSON файла
    fetch('music/simonsays/base.json')
        .then(response => response.json())
        .then(data => {
            trackTitle.textContent = `Track: ${data.Track}`;
            artistName.textContent = `Artist: ${data.Artist}`;

            const folder = data.folder;
            const segments = data.segments;

            // Построение последовательности из JSON
            for (let i = 1; i <= segments; i++) {
                const colorKey = `color0${i}`;
                const lengthKey = `length_0${i}`;
                sequence.push({
                    color: data[colorKey],
                    length: parseFloat(data[lengthKey]) * 1000,  // Преобразование в миллисекунды
                    sound: new Audio(`music/simonsays/${folder}/${i.toString().padStart(2, '0')}.mp3`)
                });
            }

            console.log('Sequence:', sequence);
        })
        .catch(error => console.error('Error loading JSON:', error));

    // Подсветка кнопок
    function highlightButton(button, colorClass, duration) {
        button.classList.add(colorClass);
        setTimeout(() => {
            button.classList.remove(colorClass);
        }, duration);
    }

    // Показ последовательности
    function showSequence() {
        let index = 0;
        isPlaying = true;
        playerSequence = [];
        goldenButton.textContent = 'Playing';

        function next() {
            if (index < sequence.length) {
                const { color, length, sound } = sequence[index];
                console.log(`Playing seq_${index + 1}: ${color}`);
                let button = getButtonByColor(color);

                highlightButton(button, `active-${color}`, length);
                sound.play();

                setTimeout(() => {
                    index++;
                    next();
                }, length - 35);  // Уменьшение задержки между кнопками
            } else {
                isPlaying = false;
                goldenButton.textContent = 'Ready';
                console.log('Wait for input');
            }
        }

        next();
    }

    // Получение кнопки по цвету
    function getButtonByColor(color) {
        switch (color) {
            case 'yellow': return yellowButton;
            case 'red': return redButton;
            case 'green': return greenButton;
            case 'blue': return blueButton;
            default: return null;
        }
    }

    // Проверка ввода игрока
    function checkInput(buttonColor) {
        if (isPlaying) return;  // Игрок не может вводить во время показа последовательности

        const expectedColor = sequence[playerSequence.length].color;
        playerSequence.push(buttonColor);

        // Подсветка кнопки при вводе игрока
        let button = getButtonByColor(buttonColor);
        const sound = sequence[playerSequence.length - 1].sound;  // Получаем звук соответствующий шагу
        highlightButton(button, `active-${buttonColor}`, sequence[playerSequence.length - 1].length);
        sound.play();

        if (buttonColor === expectedColor) {
            console.log(`Input_${playerSequence.length}: true`);
            if (playerSequence.length === sequence.length) {
                goldenButton.textContent = 'Win!';
            }
        } else {
            console.log(`Input_${playerSequence.length}: false`);
            new Audio('music/simonsays/saintpplaytest/lose.mp3').play();
            goldenButton.textContent = 'Fail!';
        }
    }

    // Нажатия кнопок
    yellowButton.addEventListener('click', () => checkInput('yellow'));
    redButton.addEventListener('click', () => checkInput('red'));
    greenButton.addEventListener('click', () => checkInput('green'));
    blueButton.addEventListener('click', () => checkInput('blue'));

    // Запуск игры
    goldenButton.addEventListener('click', () => {
        if (!isPlaying) {
            console.log('Game started');
            currentStep = 0;
            showSequence();
        }
    });
});
