// Объявляем функцию updateFormNavTip в глобальной области видимости
function updateFormNavTip() {
  const currentScreen = document.querySelector('[screen-name]:not(.hide)') as HTMLElement;
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

// Функция для очистки всех инпутов на определенном экране
function clearAllInputsOnScreen(screen: HTMLElement) {
  if (!screen) return;

  // Ищем все типы инпутов на экране
  const textInputs = screen.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="tel"], input[type="number"], textarea'
  );
  const checkboxes = screen.querySelectorAll('input[type="checkbox"]');
  const radioButtons = screen.querySelectorAll('input[type="radio"]');
  const selects = screen.querySelectorAll('select');

  // Очищаем текстовые инпуты и textarea
  textInputs.forEach((input) => {
    (input as HTMLInputElement).value = '';
  });

  // Снимаем отметки с чекбоксов
  checkboxes.forEach((checkbox) => {
    const checkboxInput = checkbox as HTMLInputElement;
    if (checkboxInput.checked) {
      checkboxInput.checked = false;
      // Обновляем атрибут checked-status, если он используется
      checkboxInput.setAttribute('checked-status', 'false');

      // Удаляем класс is-checked у родительской карточки, если есть
      const card = checkboxInput.closest('[card-checkbox-view]');
      if (card) {
        card.classList.remove('is-checked');
      }

      // Генерируем событие change для этого чекбокса, чтобы обновить состояние кнопки validate
      const changeEvent = new Event('change', { bubbles: true });
      checkboxInput.dispatchEvent(changeEvent);
    }
  });

  // Снимаем выбор с радио-кнопок
  radioButtons.forEach((radio) => {
    const radioInput = radio as HTMLInputElement;
    if (radioInput.checked) {
      radioInput.checked = false;

      // Удаляем класс is-checked у родительской карточки, если есть
      const card = radioInput.closest('[card-checkbox-view]');
      if (card) {
        card.classList.remove('is-checked');
      }

      // Генерируем событие change для этой радио-кнопки
      const changeEvent = new Event('change', { bubbles: true });
      radioInput.dispatchEvent(changeEvent);
    }
  });

  // Сбрасываем выбор в селектах
  selects.forEach((select) => {
    const selectElement = select as HTMLSelectElement;
    if (selectElement.selectedIndex !== 0) {
      selectElement.selectedIndex = 0;

      // Генерируем событие change для этого селекта
      const changeEvent = new Event('change', { bubbles: true });
      selectElement.dispatchEvent(changeEvent);
    }
  });

  // Прямой вызов updateValidateButtonState удален, так как функция будет
  // вызвана автоматически через события change на чекбоксах

  console.log(`Все инпуты на экране ${screen.getAttribute('screen-name')} были очищены`);
}

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

// Функция для обработки кликов по элементам с атрибутом radio-trigger-redirect
function setupRadioTriggerRedirection() {
  const radioTriggers = document.querySelectorAll('[radio-trigger-redirect]');

  if (radioTriggers.length) {
    radioTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();

        // Получаем значение атрибута radio-trigger-redirect
        const targetValue = trigger.getAttribute('radio-trigger-redirect');

        if (targetValue) {
          // Ищем радио-кнопку в форме с таким же значением value
          const formPopup = document.querySelector('[form-popup]');
          if (formPopup) {
            const targetRadio = formPopup.querySelector(
              `input[type="radio"][value="${targetValue}"]`
            ) as HTMLInputElement;

            if (targetRadio) {
              // Программно вызываем клик на найденной радио-кнопке
              targetRadio.click();
              console.log(`Клик перенаправлен на радио-кнопку с value="${targetValue}"`);

              // Если радио-кнопка находится внутри карточки с атрибутом card-checkbox-view,
              // нужно также активировать карточку
              const parentCard = targetRadio.closest('[card-checkbox-view]');
              if (parentCard) {
                parentCard.classList.add('is-checked');
              }
            } else {
              console.log(`Не найдена радио-кнопка с value="${targetValue}" в форме`);
            }
          } else {
            console.log('Не найдена форма [form-popup] на странице');
          }
        }
      });
    });

    console.log(
      `Настроено перенаправление кликов с ${radioTriggers.length} элементов с атрибутом radio-trigger-redirect`
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Настраиваем перенаправление кликов с fake-кнопок на real-кнопки
  setupFakeButtonRedirection();

  // Настраиваем перенаправление кликов с элементов radio-trigger-redirect на радио-кнопки
  setupRadioTriggerRedirection();

  // Функция для инициализации атрибута checked-status у чекбоксов
  function initCheckboxStatus() {
    // Находим все чекбоксы на странице
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
      const checkboxInput = checkbox as HTMLInputElement;

      // Устанавливаем начальное значение атрибута checked-status
      checkboxInput.setAttribute('checked-status', checkboxInput.checked ? 'true' : 'false');

      // Устанавливаем начальное состояние класса .wf-input-is-checked у родителя
      if (checkboxInput.checked && checkboxInput.parentElement) {
        checkboxInput.parentElement.classList.add('wf-input-is-checked');
      }

      // Добавляем обработчик клика на чекбокс
      checkboxInput.addEventListener('click', () => {
        console.log(
          `🔔 КЛИК ПО ЧЕКБОКСУ: ${checkboxInput.name || checkboxInput.id || 'безымянный чекбокс'}`
        );
      });

      // Добавляем обработчик изменения состояния чекбокса
      checkboxInput.addEventListener('change', () => {
        // Обновляем атрибут checked-status при изменении состояния
        checkboxInput.setAttribute('checked-status', checkboxInput.checked ? 'true' : 'false');
        console.log(
          `Чекбокс ${checkboxInput.name || checkboxInput.id}: checked-status="${checkboxInput.getAttribute('checked-status')}"`
        );

        // Управляем классом wf-input-is-checked у родительского элемента
        if (checkboxInput.parentElement) {
          if (checkboxInput.checked) {
            checkboxInput.parentElement.classList.add('wf-input-is-checked');
            console.log(
              `Родитель чекбокса ${checkboxInput.name || checkboxInput.id} получил класс wf-input-is-checked`
            );
          } else {
            checkboxInput.parentElement.classList.remove('wf-input-is-checked');
            console.log(
              `Родитель чекбокса ${checkboxInput.name || checkboxInput.id} потерял класс wf-input-is-checked`
            );
          }
        }

        // Находим родительскую карточку и обновляем её класс
        const card = checkboxInput.closest('[card-checkbox-view]');
        if (card) {
          if (checkboxInput.checked) {
            card.classList.add('is-checked');
            console.log(
              `Карточка для чекбокса ${checkboxInput.name || checkboxInput.id} получила класс is-checked`
            );
          } else {
            card.classList.remove('is-checked');
            console.log(
              `Карточка для чекбокса ${checkboxInput.name || checkboxInput.id} потеряла класс is-checked`
            );
          }
        }
      });
    });

    console.log(`Инициализирован атрибут checked-status для ${checkboxes.length} чекбоксов`);

    // Инициализируем радио-кнопки
    const radioButtons = document.querySelectorAll('input[type="radio"]');

    radioButtons.forEach((radio) => {
      const radioInput = radio as HTMLInputElement;

      // Устанавливаем начальное состояние класса .wf-input-is-checked у родителя
      if (radioInput.checked && radioInput.parentElement) {
        radioInput.parentElement.classList.add('wf-input-is-checked');
      }

      // Добавляем обработчик изменения состояния радио-кнопки
      radioInput.addEventListener('change', () => {
        // Сначала снимаем класс со всех радио-кнопок той же группы
        document.querySelectorAll(`input[name="${radioInput.name}"]`).forEach((rb) => {
          if (rb.parentElement) {
            rb.parentElement.classList.remove('wf-input-is-checked');
          }
        });

        // Затем добавляем класс родителю выбранной радио-кнопки
        if (radioInput.checked && radioInput.parentElement) {
          radioInput.parentElement.classList.add('wf-input-is-checked');
          console.log(
            `Родитель радио-кнопки ${radioInput.name || radioInput.id} получил класс wf-input-is-checked`
          );
        }
      });
    });

    console.log(
      `Настроено управление классом wf-input-is-checked для ${radioButtons.length} радио-кнопок`
    );
  }

  // Вызываем функцию инициализации атрибута checked-status
  initCheckboxStatus();

  // Массив для хранения истории переходов между экранами
  const screenHistory: string[] = [];

  // Массив для хранения истории шагов
  const stepHistory: string[] = [];

  // Массив для хранения "стартовых" экранов (точек входа в форму)
  const entryScreenNames: string[] = ['start'];

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
          const currentScreen = document.querySelector('[screen-name]:not(.hide)') as HTMLElement;

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
          const currentScreen = document.querySelector('[screen-name]:not(.hide)') as HTMLElement;

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
        const currentScreen = document.querySelector('[screen-name]:not(.hide)') as HTMLElement;
        const prevScreen = document.querySelector(
          `[screen-name="${prevScreenName}"]`
        ) as HTMLElement;

        if (currentScreen && prevScreen) {
          // Очищаем все инпуты на текущем экране перед переходом на предыдущий
          clearAllInputsOnScreen(currentScreen);

          switchScreen(currentScreen, prevScreen);
          stepHistory.pop(); // Удаляем последний шаг из истории
          updateStepHistoryInput();
        } else {
          const startScreen = document.querySelector('[screen-name="start"]') as HTMLElement;
          if (currentScreen && startScreen) {
            // Очищаем все инпуты на текущем экране перед переходом на стартовый
            clearAllInputsOnScreen(currentScreen);

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

      // ВАЖНО: Сброс всех инпутов формы при закрытии
      // Если клиент захочет сохранять значения полей при закрытии формы,
      // закомментируйте или удалите следующие строки
      const allScreens = document.querySelectorAll('[screen-name]');
      allScreens.forEach((screen) => {
        clearAllInputsOnScreen(screen as HTMLElement);
      });

      // Сбрасываем массив точек входа, оставляя только стартовый экран
      // Это позволит корректно работать с кнопкой Back при повторном открытии формы
      entryScreenNames.length = 0;
      entryScreenNames.push('start');
      console.log('Сброшен список точек входа в форму');

      // Через 300мс добавляем класс hide
      setTimeout(() => {
        formPopup.classList.add('hide');
      }, 300);
    }
  }

  // Функция для обновления видимости кнопки "Back"
  function updateBackButtonVisibility() {
    const backButton = document.querySelector('[form-button-back]') as HTMLElement;
    const currentScreen = document.querySelector('[screen-name]:not(.hide)') as HTMLElement;
    if (backButton && currentScreen) {
      const currentScreenName = currentScreen.getAttribute('screen-name') || '';
      // Прячем кнопку Back на экранах, которые помечены как точки входа в форму
      const shouldHide = entryScreenNames.includes(currentScreenName);
      backButton.classList.toggle('hide-opacity', shouldHide);

      console.log(
        `Кнопка Back ${shouldHide ? 'скрыта' : 'показана'} на экране ${currentScreenName}`
      );
    }
  }

  // Функция для обновления видимости нижней навигации
  function updateBottomNavVisibility() {
    const bottomNav = document.querySelector('.section_step.is-form-nav-bot') as HTMLElement;
    const currentScreen = document.querySelector('[screen-name]:not(.hide)') as HTMLElement;

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
          // Получаем имя стартового экрана
          const entryScreenName = startScreen.getAttribute('screen-name');

          // Добавляем этот экран в список точек входа, если его там еще нет
          if (entryScreenName && !entryScreenNames.includes(entryScreenName)) {
            entryScreenNames.push(entryScreenName);
            console.log(`Экран "${entryScreenName}" добавлен как точка входа`);
          }

          // Очищаем историю переходов при открытии формы
          screenHistory.length = 0;

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

          // Добавляем предыдущий экран в историю только если это не стартовый экран
          // Это убрано, так как мы не хотим добавлять ничего в историю
          // if (screenName !== 'start') {
          //   screenHistory.push('start');
          //
          //   if (!stepHistory.includes('start')) {
          //     stepHistory.push('start');
          //     updateStepHistoryInput();
          //   }
          // }

          // Обновляем видимость кнопки Back после открытия формы
          updateBackButtonVisibility();

          // Обновляем видимость нижней навигации
          updateBottomNavVisibility();
        }
      }
    });
  });

  function updateValidateButtonState() {
    const validateScreen = document.querySelector('[validate]');
    if (!validateScreen) return;

    const checkboxes = validateScreen.querySelectorAll('input[type="checkbox"]');
    const validateButton = validateScreen.querySelector('[validate-button]');

    if (!validateButton) return;

    const isAnyCheckboxChecked = Array.from(checkboxes).some(
      (checkbox) => (checkbox as HTMLInputElement).checked
    );

    if (isAnyCheckboxChecked) {
      validateButton.classList.remove('disabled');
    } else {
      validateButton.classList.add('disabled');
    }
  }

  // Добавляем обработчик изменения состояния для всех чекбоксов
  const validateScreen = document.querySelector('[validate]');
  if (validateScreen) {
    const checkboxes = validateScreen.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', updateValidateButtonState);
    });

    // Инициализируем состояние кнопки при загрузке страницы
    updateValidateButtonState();
  }
});
