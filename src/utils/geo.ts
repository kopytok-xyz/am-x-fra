import axios from 'axios';

/**
 * ИНСТРУКЦИЯ ПО РАБОТЕ С РЕГИОНАЛЬНЫМИ ФИЛЬТРАМИ
 *
 * 1. КАК РАБОТАЕТ СОПОСТАВЛЕНИЕ РЕГИОНОВ:
 *    - Скрипт получает геолокацию пользователя через geo.js API
 *    - API возвращает код континента (например, EU, AS, NA) и страну
 *    - Скрипт сопоставляет эти данные с доступными фильтрами на странице
 *
 * 2. РЕКОМЕНДУЕМЫЕ ЗНАЧЕНИЯ ДЛЯ ФИЛЬТРОВ:
 *    | Код GeoJS | Регион             | Значение для filter-by |
 *    |-----------|--------------------|-----------------------|
 *    | EU        | Европа             | europe                |
 *    | AS        | Азия               | asia                  |
 *    | NA        | Северная Америка   | usa                   |
 *    | SA        | Южная Америка      | south-america         |
 *    | AF        | Африка             | africa                |
 *    | OC        | Океания            | oceania               |
 *    | ME        | Ближний Восток     | uae                   |
 *    | AN        | Антарктика         | antarctica            |
 *
 * 3. КАК ДОБАВЛЯТЬ НОВЫЕ РЕГИОНЫ:
 *    - Создайте радио-кнопку с атрибутом name="region-list"
 *    - Установите атрибут filter-by равным значению из таблицы выше
 *    - Атрибут filter-by-name может содержать любое удобное для отображения название
 *    - Пример: <input name="region-list" filter-by="africa" filter-by-name="Africa" type="radio">
 *
 * 4. АЛГОРИТМ СОПОСТАВЛЕНИЯ:
 *    - Сначала ищет точное соответствие кода континента или названия страны
 *    - Потом проверяет частичные совпадения (например, "emirates" в "united arab emirates")
 *    - Если совпадение не найдено, выбирает первый доступный фильтр
 */

// Функция для применения фильтра по региону на основе геолокации
function applyRegionFilter(regionCode: string, countryName: string) {
  console.log(`Пытаемся применить фильтр по региону: ${regionCode}, страна: ${countryName}`);

  // Получаем все доступные радио-кнопки фильтра по региону
  const regionFilters = document.querySelectorAll<HTMLInputElement>(
    'input[type="radio"][name="region-list"]'
  );

  // Если нет фильтров, выходим
  if (regionFilters.length === 0) {
    console.log('Не найдены фильтры по регионам');
    return;
  }

  // Создаем массив доступных значений фильтров
  const availableFilters: { value: string; element: HTMLInputElement }[] = [];
  regionFilters.forEach((filter) => {
    const filterValue = filter.getAttribute('filter-by') || '';
    availableFilters.push({ value: filterValue.toLowerCase(), element: filter });
  });

  console.log(
    'Доступные фильтры:',
    availableFilters.map((f) => f.value)
  );

  // Пытаемся найти подходящий фильтр на основе кода континента
  let matchedFilter: HTMLInputElement | null = null;

  // Создаем массив возможных значений для поиска соответствия
  // Преобразуем всё в нижний регистр для надежного сравнения
  const searchValues = [
    regionCode.toLowerCase(), // Код континента
    countryName.toLowerCase(), // Название страны
  ];

  // Для некоторых известных континентов добавим расширенные варианты поиска
  // Это помогает сопоставить коды континентов с общепринятыми названиями
  if (regionCode === 'EU') searchValues.push('europe');
  if (regionCode === 'AS') searchValues.push('asia');
  if (regionCode === 'NA') searchValues.push('usa', 'america', 'north america');
  if (regionCode === 'ME') searchValues.push('middle east', 'uae');
  if (regionCode === 'SA') searchValues.push('south america', 'latin america');
  if (regionCode === 'AF') searchValues.push('africa');
  if (regionCode === 'OC') searchValues.push('oceania', 'australia');

  // Специальная обработка для некоторых стран
  if (countryName.includes('Arab') || countryName === 'UAE') {
    searchValues.push('uae', 'emirates');
  }
  if (countryName.includes('United States') || countryName === 'USA') {
    searchValues.push('usa', 'america');
  }
  if (countryName.includes('United Kingdom') || countryName === 'UK') {
    searchValues.push('europe', 'uk');
  }

  console.log('Ищем соответствие для:', searchValues);

  // Пытаемся найти соответствие в три этапа:
  // 1. Точное совпадение
  // 2. Значение фильтра содержится в искомом значении
  // 3. Искомое значение содержится в значении фильтра
  for (const searchValue of searchValues) {
    for (const { value, element } of availableFilters) {
      if (value === searchValue || value.includes(searchValue) || searchValue.includes(value)) {
        matchedFilter = element;
        console.log(`Найдено соответствие: ${searchValue} -> ${value}`);
        break;
      }
    }
    if (matchedFilter) break;
  }

  // Если не нашли соответствие, выбираем первый доступный фильтр
  if (!matchedFilter && regionFilters.length > 0) {
    const [firstFilter] = regionFilters;
    matchedFilter = firstFilter;
    console.log(
      `Не найдено точного соответствия, выбираем первый доступный фильтр: ${matchedFilter.getAttribute('filter-by')}`
    );
  }

  // Применяем выбранный фильтр
  if (matchedFilter) {
    matchedFilter.checked = true;

    // Генерируем событие change для запуска фильтрации
    const changeEvent = new Event('change', { bubbles: true });
    matchedFilter.dispatchEvent(changeEvent);

    console.log(`Применен фильтр по региону: ${matchedFilter.getAttribute('filter-by')}`);
  }
}

export const func_geo = async () => {
  try {
    // Получаем геолокацию пользователя через API geo.js
    const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
    const { city, country, continent_code } = response.data;

    console.log('Получены данные геолокации:', { city, country, continent_code });

    // Добавляем атрибуты к body для возможного использования в CSS или других скриптах
    document.body.setAttribute('data-city', city);
    document.body.setAttribute('data-country', country);
    document.body.setAttribute('data-region', continent_code);

    // Применяем фильтр по региону с небольшой задержкой, чтобы DOM успел обновиться
    setTimeout(() => {
      applyRegionFilter(continent_code, country);
    }, 1000);
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
