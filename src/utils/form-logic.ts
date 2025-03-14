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

// Функция для перенаправления клика с fake-кнопок на real-кнопки
function setupFakeButtonRedirection() {
  const fakeButtons = document.querySelectorAll('[form-button-fake]');
  const realButton = document.querySelector('[form-button-real]');

  if (fakeButtons.length && realButton) {
    fakeButtons.forEach((fakeButton) => {
      fakeButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Программно вызываем клик на реальной кнопке
        (realButton as HTMLElement).click();

        console.log('Клик перенаправлен с fake-кнопки на real-кнопку');
      });
    });

    console.log(
      `Настроено перенаправление кликов с ${fakeButtons.length} fake-кнопок на real-кнопку`
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Настраиваем перенаправление кликов с fake-кнопок на real-кнопки
  setupFakeButtonRedirection();

  // Массив для хранения истории переходов между экранами
  const screenHistory: string[] = [];

  // Массив для хранения истории шагов
  const stepHistory: string[] = [];

  // Функция для замены значений value у элементов с атрибутом need-top-replace-with-js
  function replaceValuesFromParentAttributes() {
    // Находим все радио-кнопки и чекбоксы
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Объединяем коллекции в один массив
    const allInputs = [...radioButtons, ...checkboxes];

    allInputs.forEach((input) => {
      const inputElement = input as HTMLInputElement;

      // Проверяем, пустое ли значение value
      if (!inputElement.value || inputElement.value === 'need-top-replace-with-js') {
        // Ищем ближайшего родителя с атрибутом need-top-replace-with-js-src
        let parent = inputElement.parentElement;
        let sourceValue = null;

        // Поднимаемся вверх по DOM-дереву, пока не найдем родителя с нужным атрибутом
        while (parent && !sourceValue) {
          sourceValue = parent.getAttribute('need-top-replace-with-js-src');
          if (!sourceValue) {
            parent = parent.parentElement;
          }
        }

        // Если нашли значение, устанавливаем его в value элемента
        if (sourceValue) {
          inputElement.value = sourceValue;
          console.log(
            `Заменено пустое значение value для элемента с id="${inputElement.id}" на "${sourceValue}" из родительского атрибута`
          );
        } else {
          console.log(
            `Не найден родитель с атрибутом need-top-replace-with-js-src для элемента:`,
            inputElement
          );
        }
      }
    });
  }

  // Вызываем функцию замены значений после загрузки DOM
  setTimeout(replaceValuesFromParentAttributes, 100);

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

      // Обновляем видимость кнопки "Back"
      updateBackButtonVisibility();

      // Обновляем видимость нижней навигации
      updateBottomNavVisibility();
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

            // Проверяем, если шаг уже существует в истории, не добавляем его снова
            if (!stepHistory.includes(nextScreenName)) {
              stepHistory.push(nextScreenName);
            }

            // Переключаем экраны
            switchScreen(currentScreen, nextScreen);
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
      if (screenHistory.length > 0) {
        const prevScreenName = screenHistory.pop();
        const currentScreen = document.querySelector('.section_step:not(.hide)') as HTMLElement;
        const prevScreen = document.querySelector(
          `[screen-name="${prevScreenName}"]`
        ) as HTMLElement;

        if (currentScreen && prevScreen) {
          switchScreen(currentScreen, prevScreen);
          stepHistory.pop(); // Удаляем последний шаг из истории
          updateStepHistoryInput();
        } else {
          const startScreen = document.querySelector('[screen-name="start"]') as HTMLElement;
          if (currentScreen && startScreen) {
            switchScreen(currentScreen, startScreen);
          }
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

  // Функция для обновления видимости нижней навигации
  function updateBottomNavVisibility() {
    const bottomNav = document.querySelector('.section_step.is-form-nav-bot') as HTMLElement;
    const currentScreen = document.querySelector('.section_step:not(.hide)') as HTMLElement;

    if (bottomNav && currentScreen) {
      const isChoosePartnerScreen = currentScreen.getAttribute('screen-name') === 'choose-partner';

      // Показываем нижнюю навигацию только на экране choose-partner
      if (isChoosePartnerScreen) {
        bottomNav.classList.remove('hide');
      } else {
        bottomNav.classList.add('hide');
      }

      console.log(
        `Нижняя навигация ${isChoosePartnerScreen ? 'показана' : 'скрыта'} на экране ${currentScreen.getAttribute('screen-name')}`
      );
    }
  }

  // Обновляем видимость кнопки "Back" при загрузке страницы
  updateBackButtonVisibility();

  // Обновляем видимость нижней навигации при загрузке страницы
  updateBottomNavVisibility();

  // Инициализируем текст подсказки при загрузке страницы
  updateFormNavTip();

  // Функция для логирования всех инпутов формы
  function logAllFormInputs() {
    const formElement = document.querySelector('form');
    if (!formElement) return;

    console.log('--- Текущие значения всех инпутов формы ---');

    // Получаем данные из FormData для обычных инпутов
    const formData = new FormData(formElement);
    const inputValues: Record<string, string> = {};

    formData.forEach((value, key) => {
      inputValues[key] = value.toString();
    });

    // Дополнительно собираем информацию о всех радио-кнопках и чекбоксах
    const radioButtons = formElement.querySelectorAll('input[type="radio"]');
    const checkboxes = formElement.querySelectorAll('input[type="checkbox"]');

    // Группируем радио-кнопки по имени
    const radioGroups: Record<string, { options: string[]; selected: string }> = {};

    radioButtons.forEach((radio) => {
      const radioInput = radio as HTMLInputElement;
      const { name } = radioInput;
      const { value } = radioInput;

      if (!radioGroups[name]) {
        radioGroups[name] = { options: [], selected: '' };
      }

      radioGroups[name].options.push(value);
      if (radioInput.checked) {
        radioGroups[name].selected = value;
      }
    });

    // Добавляем информацию о радио-группах в отчет
    Object.entries(radioGroups).forEach(([name, group]) => {
      inputValues[`${name} (радио-группа)`] =
        `Выбрано: ${group.selected || 'ничего'} из [${group.options.join(', ')}]`;
    });

    // Добавляем информацию о чекбоксах
    checkboxes.forEach((checkbox) => {
      const checkboxInput = checkbox as HTMLInputElement;
      inputValues[`${checkboxInput.name} (чекбокс)`] = checkboxInput.checked
        ? 'Выбран'
        : 'Не выбран';
    });

    console.table(inputValues); // Выводим в виде таблицы для лучшей читаемости
    console.log('--- Конец списка значений инпутов ---');
  }

  // Функция для обновления скрытого инпута с историей шагов
  function updateStepHistoryInput() {
    const stepHistoryInput = document.querySelector('[name="step-history"]') as HTMLInputElement;
    if (stepHistoryInput) {
      stepHistoryInput.value = stepHistory.join('-->');

      // Логируем значения инпутов после обновления истории шагов
      logAllFormInputs();
    }
  }

  // Добавляем скрытый инпут для истории шагов
  const formElement = document.querySelector('form');

  if (formElement) {
    const stepHistoryInput = document.createElement('input');
    stepHistoryInput.type = 'hidden';
    stepHistoryInput.name = 'step-history';
    formElement.appendChild(stepHistoryInput);
    console.log('Создан скрытый инпут для истории шагов: name="step-history"');

    // Отслеживаем изменения в любом инпуте формы
    formElement.addEventListener('input', () => {
      logAllFormInputs();
    });

    // Отслеживаем изменения в радио-кнопках и чекбоксах
    formElement.addEventListener('change', (event) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' &&
        (target.getAttribute('type') === 'radio' || target.getAttribute('type') === 'checkbox')
      ) {
        logAllFormInputs();
      }
    });

    // Логируем начальные значения
    setTimeout(logAllFormInputs, 500); // Небольшая задержка для инициализации формы
  }

  // Обработчик для кликов по элементам с атрибутом [story-point]
  const storyPoints = document.querySelectorAll('[story-point]');
  storyPoints.forEach((point) => {
    point.addEventListener('click', () => {
      const pointName = point.getAttribute('story-point');
      if (pointName) {
        if (!stepHistory.includes(pointName)) {
          stepHistory.push(pointName);
          updateStepHistoryInput();
        }
      }
    });
  });

  // Удаляем запрет на отправку формы и добавляем логи по содержимому инпутов перед отправкой
  if (formElement) {
    formElement.addEventListener('submit', () => {
      // Логируем содержимое всех инпутов перед отправкой
      console.log('--- Содержимое инпутов перед отправкой формы ---');
      const formData = new FormData(formElement);
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      console.log('--- Конец содержимого инпутов ---');
    });
  }

  // Обработчик для открытия формы при клике на элементы с атрибутом open-form-trigger
  const openFormTriggers = document.querySelectorAll('[open-form-trigger]');
  openFormTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const screenName = trigger.getAttribute('open-form-trigger');
      if (screenName) {
        const formPopup = document.querySelector('[form-popup]') as HTMLElement;
        let startScreen = document.querySelector(`[screen-name="${screenName}"]`) as HTMLElement;
        if (!startScreen) {
          startScreen = document.querySelector('[screen-name="start"]') as HTMLElement;
        }
        if (formPopup && startScreen) {
          // Сначала скрываем все экраны
          document.querySelectorAll('[screen-name]').forEach((screen) => {
            (screen as HTMLElement).classList.add('hide');
          });

          // Затем показываем только нужный экран
          formPopup.classList.remove('hide');
          startScreen.classList.remove('hide');
          updateFormNavTip();
          formPopup.style.opacity = '1';
          startScreen.style.opacity = '1';

          // Если открываемый экран не "start", добавляем "start" в историю переходов
          if (screenName !== 'start') {
            screenHistory.push('start');

            // Также добавляем в историю шагов, если нужно
            if (!stepHistory.includes('start')) {
              stepHistory.push('start');
              updateStepHistoryInput();
            }
          }

          // Обновляем видимость кнопки Back после открытия формы
          updateBackButtonVisibility();

          // Обновляем видимость нижней навигации
          updateBottomNavVisibility();
        }
      }
    });
  });
});
