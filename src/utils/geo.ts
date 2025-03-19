import axios from 'axios';

// Функция для применения фильтра по региону на основе геолокации
function applyRegionFilter(regionCode: string) {
  console.log(`Пытаемся применить фильтр по региону: ${regionCode}`);

  // Соответствие кодов континентов из geo.js значениям фильтра
  const regionMapping: Record<string, string> = {
    EU: 'europe', // Европа
    AS: 'asia', // Азия
    NA: 'usa', // Северная Америка -> США
    AE: 'uae', // ОАЭ (специальный случай)
    ME: 'uae', // Ближний Восток -> ОАЭ
  };

  // Получаем значение для фильтра на основе кода региона
  const filterValue = regionMapping[regionCode] || '';

  // Если нет подходящего значения для фильтра, выбираем первый регион из списка
  if (!filterValue) {
    console.log(
      `Не найдено соответствие для региона ${regionCode}, выбираем первый доступный фильтр`
    );

    // Находим все радио-кнопки фильтра региона
    const regionFilters = document.querySelectorAll('input[type="radio"][name="region-list"]');

    if (regionFilters.length > 0) {
      // Выбираем первую радио-кнопку
      const firstRegionFilter = regionFilters[0] as HTMLInputElement;
      firstRegionFilter.checked = true;

      // Генерируем событие change для запуска фильтрации
      const changeEvent = new Event('change', { bubbles: true });
      firstRegionFilter.dispatchEvent(changeEvent);

      console.log(`Выбран первый доступный фильтр региона: ${firstRegionFilter.value}`);
    } else {
      console.log('Не найдены фильтры по регионам');
    }

    return;
  }

  // Находим радио-кнопку фильтра с соответствующим значением
  const regionFilter = document.querySelector(
    `input[type="radio"][name="region-list"][filter-by="${filterValue}"]`
  ) as HTMLInputElement;

  if (regionFilter) {
    // Отмечаем радио-кнопку фильтра
    regionFilter.checked = true;

    // Генерируем событие change для запуска фильтрации
    const changeEvent = new Event('change', { bubbles: true });
    regionFilter.dispatchEvent(changeEvent);

    console.log(`Успешно применен фильтр по региону: ${filterValue}`);
  } else {
    console.log(`Не найден фильтр для региона: ${filterValue}`);

    // Если не найден конкретный фильтр, выбираем первый
    const regionFilters = document.querySelectorAll('input[type="radio"][name="region-list"]');

    if (regionFilters.length > 0) {
      // Выбираем первую радио-кнопку
      const firstRegionFilter = regionFilters[0] as HTMLInputElement;
      firstRegionFilter.checked = true;

      // Генерируем событие change для запуска фильтрации
      const changeEvent = new Event('change', { bubbles: true });
      firstRegionFilter.dispatchEvent(changeEvent);

      console.log(`Выбран первый доступный фильтр региона: ${firstRegionFilter.value}`);
    } else {
      console.log('Не найдены фильтры по регионам');
    }
  }
}

export const func_geo = async () => {
  try {
    const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
    const { city, country, continent_code } = response.data;

    console.log('Получены данные геолокации:', { city, country, continent_code });

    // Добавляем атрибуты к body
    document.body.setAttribute('data-city', city);
    document.body.setAttribute('data-country', country);
    document.body.setAttribute('data-region', continent_code);

    // Особая обработка для ОАЭ
    if (country === 'United Arab Emirates' || country === 'UAE') {
      document.body.setAttribute('data-special-region', 'uae');
      applyRegionFilter('AE');
    } else {
      // Применяем фильтр по региону на основе кода континента
      applyRegionFilter(continent_code);
    }
  } catch (error) {
    console.error('Ошибка при получении геолокации:', error);
  }
};

// Задержка инициализации для уверенности, что DOM полностью загружен
document.addEventListener('DOMContentLoaded', () => {
  // Ждем небольшое время, чтобы убедиться, что все фильтры инициализированы
  setTimeout(() => {
    func_geo();
  }, 1000);
});
