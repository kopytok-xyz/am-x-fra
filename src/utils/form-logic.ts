// Объявляем функцию updateFormNavTip в глобальной области видимости
function updateFormNavTip() {
  const currentScreen = document.querySelector('.section_step:not(.hide)') as HTMLElement;
  const formNavTipText = document.querySelector('[form-nav-tip-text]') as HTMLElement;

  if (currentScreen && formNavTipText) {
    const screenTip = currentScreen.getAttribute('screen-tip');
    if (screenTip) {
      formNavTipText.textContent = screenTip;
    } else {
      formNavTipText.textContent = '*';
    }
  }
}

export const func_formLogic = () => {
  const all_formLogicEl = document.querySelectorAll('.section_multistep-form-block');
  if (all_formLogicEl.length) {
    // Инициализация формы
    updateFormNavTip();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Массив для хранения истории переходов между экранами
  const screenHistory: string[] = [];

  // Функция для перехода между экранами с анимацией
  function switchScreen(currentScreen: HTMLElement, nextScreen: HTMLElement) {
    // Плавно скрываем текущий экран
    currentScreen.style.transition = 'opacity 300ms ease';
    currentScreen.style.opacity = '0';

    // Через 300мс скрываем текущий экран и показываем следующий
    setTimeout(() => {
      // Скрываем текущий экран
      currentScreen.classList.add('hide');

      // Подготавливаем следующий экран (сначала с нулевой прозрачностью)
      nextScreen.style.transition = 'opacity 300ms ease';
      nextScreen.style.opacity = '0';
      nextScreen.classList.remove('hide');

      // Форсируем перерисовку для применения стилей
      void nextScreen.offsetWidth;

      // Плавно показываем следующий экран
      nextScreen.style.opacity = '1';

      // Обновляем текст подсказки в навигации формы
      updateFormNavTip();

      console.log(
        `Переключение с экрана ${currentScreen.getAttribute('screen-name')} на экран ${nextScreen.getAttribute('screen-name')}`
      );

      // Обновляем видимость кнопки "Back"
      updateBackButtonVisibility();
    }, 300);
  }

  const cardCheckboxViews = document.querySelectorAll('[card-checkbox-view]');

  cardCheckboxViews.forEach((card) => {
    card.addEventListener('click', (event) => {
      // Предотвращаем всплытие события
      event.stopPropagation();

      const radioButton = card.querySelector('input[type="radio"]') as HTMLInputElement;

      if (radioButton) {
        // Сначала снимаем выделение со всех радио-кнопок с тем же именем
        document.querySelectorAll(`input[name="${radioButton.name}"]`).forEach((rb) => {
          (rb as HTMLInputElement).checked = false;
          rb.closest('[card-checkbox-view]')?.classList.remove('is-checked');
        });

        // Устанавливаем checked = true для текущей радио-кнопки
        radioButton.checked = true;

        // Добавляем класс is-checked к текущей карточке
        card.classList.add('is-checked');

        console.log(
          `Radio name: ${radioButton.name}, value: ${radioButton.value}, status: ${radioButton.checked ? 'checked' : 'unchecked'}`
        );
        console.log(`Card class list: ${card.classList}`);

        // Проверяем наличие атрибута screen-name-next
        const nextScreenName = card.getAttribute('screen-name-next');
        if (nextScreenName) {
          // Находим текущий активный экран
          const currentScreen = document.querySelector('.section_step:not(.hide)') as HTMLElement;

          // Находим следующий экран по атрибуту screen-name
          const nextScreen = document.querySelector(
            `[screen-name="${nextScreenName}"]`
          ) as HTMLElement;

          if (currentScreen && nextScreen) {
            // Сохраняем текущий экран в историю
            const currentScreenName = currentScreen.getAttribute('screen-name');
            if (currentScreenName) {
              screenHistory.push(currentScreenName);
            }

            // Переключаем экраны
            switchScreen(currentScreen, nextScreen);
          } else {
            console.log(
              `Не удалось найти экраны для переключения. Текущий: ${currentScreen ? currentScreen.getAttribute('screen-name') : 'не найден'}, следующий: ${nextScreenName}`
            );
          }
        }
      }
    });
  });

  // Также добавим обработчик для кнопки "Next" на экране тренинга
  const nextButtons = document.querySelectorAll('[screen-name-next]');
  nextButtons.forEach((button) => {
    if (button.classList.contains('button')) {
      button.addEventListener('click', (event) => {
        event.preventDefault();

        const nextScreenName = button.getAttribute('screen-name-next');
        if (nextScreenName) {
          // Находим текущий активный экран
          const currentScreen = document.querySelector('.section_step:not(.hide)') as HTMLElement;

          // Находим следующий экран по атрибуту screen-name
          const nextScreen = document.querySelector(
            `[screen-name="${nextScreenName}"]`
          ) as HTMLElement;

          if (currentScreen && nextScreen) {
            // Сохраняем текущий экран в историю
            const currentScreenName = currentScreen.getAttribute('screen-name');
            if (currentScreenName) {
              screenHistory.push(currentScreenName);
            }

            // Переключаем экраны
            switchScreen(currentScreen, nextScreen);
          }
        }
      });
    }
  });

  // Обработчик для кнопки "Back"
  const backButton = document.querySelector('[form-button-back]');
  if (backButton) {
    backButton.addEventListener('click', () => {
      // Проверяем, есть ли история переходов
      if (screenHistory.length > 0) {
        // Получаем последний экран из истории
        const prevScreenName = screenHistory.pop();

        // Находим текущий активный экран
        const currentScreen = document.querySelector('.section_step:not(.hide)') as HTMLElement;

        // Находим предыдущий экран по имени из истории
        const prevScreen = document.querySelector(
          `[screen-name="${prevScreenName}"]`
        ) as HTMLElement;

        if (currentScreen && prevScreen) {
          // Переключаем экраны
          switchScreen(currentScreen, prevScreen);
        }
      }
    });
  }

  // Обработчик для кнопки "Esc"
  const escButton = document.querySelector('[form-button-esc]');
  if (escButton) {
    escButton.addEventListener('click', closeForm);
  }

  // Обработчик для клавиши Esc на клавиатуре
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeForm();
    }
  });

  // Функция для закрытия формы
  function closeForm() {
    const formPopup = document.querySelector('[form-popup]') as HTMLElement;
    if (formPopup) {
      // Плавно скрываем форму
      formPopup.style.transition = 'opacity 300ms ease';
      formPopup.style.opacity = '0';

      // Через 300мс добавляем класс hide
      setTimeout(() => {
        formPopup.classList.add('hide');
      }, 300);
    }
  }

  // Функция для обновления видимости кнопки "Back"
  function updateBackButtonVisibility() {
    const backButton = document.querySelector('[form-button-back]') as HTMLElement;
    const currentScreen = document.querySelector('.section_step:not(.hide)') as HTMLElement;
    if (backButton && currentScreen) {
      const isStartScreen = currentScreen.getAttribute('screen-name') === 'start';
      backButton.classList.toggle('hide-opacity', isStartScreen);
    }
  }

  // Обновляем видимость кнопки "Back" при загрузке страницы
  updateBackButtonVisibility();

  // Инициализируем текст подсказки при загрузке страницы
  updateFormNavTip();
});
