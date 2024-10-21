document.addEventListener('DOMContentLoaded', () => {
    // Загружаем данные из JSON файла
    fetch('music/simonsays/apperance.json')
        .then(response => response.json())
        .then(data => {
            // Устанавливаем фоновое изображение
            const folder = data.folder;
            const imageUrl = `music/simonsays/${folder}/${data.image}`;
            const bgColor = data.bg;

            // Проверяем, какой URL используется для изображения
            console.log('Image URL:', imageUrl);

            // Создание стиля для фона
            const bodyStyle = document.body.style;
            bodyStyle.backgroundImage = `url(${imageUrl})`;
            bodyStyle.backgroundSize = 'cover';
            bodyStyle.backgroundPosition = 'center';

            // Добавление градиента
            bodyStyle.background = `linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, ${bgColor} 100%)`;
        })
        .catch(error => console.error('Error loading appearance data:', error));
});
