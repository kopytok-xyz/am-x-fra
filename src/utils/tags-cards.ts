export const tagsCards = () => {
  const all_tagsCards = document.querySelectorAll('.card-features');
  if (all_tagsCards.length) {
    all_tagsCards.forEach((card) => {
      card.addEventListener('click', (event) => {
        // if (event.target.closest('ul')) {
        //   return;
        // }
        const imageWrapper = card.querySelector('.card-features_image-wrapper');
        const featuresListWrapper = card.querySelector('.card-features_features-list-wrapper');
        const plusButtonIcon = card.querySelector('.card-features_plus-button-icon');
        if (imageWrapper) {
          imageWrapper.classList.toggle('hide');
        }
        if (featuresListWrapper) {
          featuresListWrapper.classList.toggle('hide');
        }
        if (plusButtonIcon) {
          plusButtonIcon.classList.toggle('is-active');
        }
      });
    });
  }
};
