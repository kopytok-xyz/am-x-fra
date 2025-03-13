export const func_formLogic = () => {
  const all_formLogicEl = document.querySelectorAll('.section_multistep-form-block');
  if (all_formLogicEl.length) {
    //
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const cardCheckboxViews = document.querySelectorAll('[card-checkbox-view]');

  cardCheckboxViews.forEach((card) => {
    card.addEventListener('click', (event) => {
      // Предотвращаем всплытие события
      event.stopPropagation();

      const radioButton = card.querySelector('input[type="radio"]');

      if (radioButton) {
        // Сначала снимаем выделение со всех радио-кнопок с тем же именем
        document.querySelectorAll(`input[name="${radioButton.name}"]`).forEach((rb) => {
          rb.checked = false;
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
          const currentScreen = document.querySelector('.section_step:not(.hide)');

          // Находим следующий экран по атрибуту screen-name
          const nextScreen = document.querySelector(`[screen-name="${nextScreenName}"]`);

          if (currentScreen && nextScreen) {
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

              console.log(
                `Переключение с экрана ${currentScreen.getAttribute('screen-name')} на экран ${nextScreenName}`
              );
            }, 300);
          } else {
            console.log(
              `Не удалось найти экраны для переключения. Текущий: ${currentScreen ? currentScreen.getAttribute('screen-name') : 'не найден'}, следующий: ${nextScreenName}`
            );
          }
        }
      }
    });
  });
});
