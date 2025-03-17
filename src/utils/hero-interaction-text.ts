export const func_heroInteractionText = () => {
  const all_sections = document.querySelectorAll('.hero-lottie-trigger');
  if (all_sections.length) {
    // Получаем все элементы hero-lottie-trigger с классами is-1, is-2, is-3
    const triggerElements = [
      document.querySelector('.hero-lottie-trigger.is-1'),
      document.querySelector('.hero-lottie-trigger.is-2'),
      document.querySelector('.hero-lottie-trigger.is-3'),
    ];

    // Получаем все элементы hero_text-phrase с классами is-1, is-2, is-3
    const textElements = [
      document.querySelector('.hero_text-phrase.is-1'),
      document.querySelector('.hero_text-phrase.is-2'),
      document.querySelector('.hero_text-phrase.is-3'),
    ];

    // Проверяем, что все элементы найдены
    if (triggerElements.every((el) => el) && textElements.every((el) => el)) {
      // Функция для проверки видимости элемента
      const isVisible = (element: Element): boolean => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none';
      };

      // Функция для плавного показа элемента
      const fadeIn = (element: Element, duration: number = 500): void => {
        // Сначала устанавливаем стили для анимации
        (element as HTMLElement).style.transition = `opacity ${duration}ms ease`;
        (element as HTMLElement).style.opacity = '0';

        // Удаляем класс hide после установки стилей
        element.classList.remove('hide');

        // Запускаем анимацию после небольшой задержки для применения стилей
        requestAnimationFrame(() => {
          (element as HTMLElement).style.opacity = '1';
        });
      };

      // Функция для плавного скрытия элемента
      const fadeOut = (element: Element, duration: number = 500): Promise<void> => {
        return new Promise((resolve) => {
          // Устанавливаем переход
          (element as HTMLElement).style.transition = `opacity ${duration}ms ease`;
          (element as HTMLElement).style.opacity = '0';

          // После завершения анимации добавляем класс hide
          setTimeout(() => {
            element.classList.add('hide');
            // Сбрасываем opacity для будущих анимаций
            (element as HTMLElement).style.opacity = '';
            resolve();
          }, duration);
        });
      };

      // Функция для обновления видимости текстовых элементов с анимацией
      const updateTextVisibility = async () => {
        let visibleTriggerIndex = -1;

        // Находим индекс видимого триггера
        for (let i = 0; i < 3; i++) {
          const trigger = triggerElements[i];
          if (trigger && isVisible(trigger)) {
            visibleTriggerIndex = i;
            break;
          }
        }

        if (visibleTriggerIndex !== -1) {
          // Скрываем все элементы, кроме того, который должен быть видимым
          const hidePromises: Promise<void>[] = [];

          textElements.forEach((el, index) => {
            if (index !== visibleTriggerIndex && el && !el.classList.contains('hide')) {
              hidePromises.push(fadeOut(el));
            }
          });

          // Ждем завершения всех анимаций скрытия
          await Promise.all(hidePromises);

          // Показываем нужный элемент
          const textToShow = textElements[visibleTriggerIndex];
          if (textToShow && textToShow.classList.contains('hide')) {
            fadeIn(textToShow);
          }
        }
      };

      // Инициализируем начальное состояние
      updateTextVisibility();

      // Создаем MutationObserver для отслеживания изменений стилей
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'style' || mutation.attributeName === 'class') {
            updateTextVisibility();
          }
        });
      });

      // Наблюдаем за изменениями атрибутов style и class у всех триггеров
      triggerElements.forEach((el) => {
        if (el) {
          observer.observe(el, { attributes: true, attributeFilter: ['style', 'class'] });
        }
      });
    }
  }
};
