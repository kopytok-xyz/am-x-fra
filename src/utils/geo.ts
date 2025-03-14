import axios from 'axios';

export const func_geo = async () => {
  try {
    const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
    const { city, country, continent_code } = response.data;

    // Добавляем атрибуты к body
    document.body.setAttribute('data-city', city);
    document.body.setAttribute('data-country', country);
    document.body.setAttribute('data-region', continent_code);
  } catch (error) {
    console.error('Ошибка при получении геолокации:', error);
  }
};

window.onload = () => {
  func_geo();
};
