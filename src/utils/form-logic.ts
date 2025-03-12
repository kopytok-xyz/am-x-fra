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
      }
    });
  });
});
