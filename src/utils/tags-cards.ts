export const tagsCards = () => {
  const all_tagsCards = document.querySelectorAll('.card-features');
  if (all_tagsCards.length) {
    all_tagsCards.forEach((card) => {
      card.addEventListener('click', () => {
        const imageWrapper = card.querySelector('.card-features_image-wrapper');
        const featuresListWrapper = card.querySelector('.card-features_features-list-wrapper');
        const plusButtonIcon = card.querySelector('.card-features_plus-button-icon');
        const listItems = card.querySelectorAll('.card-features_features-list-item');

        if (imageWrapper) {
          imageWrapper.classList.toggle('hide');
          if (!imageWrapper.classList.contains('hide')) {
            imageWrapper.style.opacity = '0';
            setTimeout(() => {
              imageWrapper.style.transition = 'opacity 1s ease';
              imageWrapper.style.opacity = '1';
            }, 0);
          } else {
            imageWrapper.style.opacity = '0';
          }
        }
        if (featuresListWrapper) {
          featuresListWrapper.classList.toggle('hide');
          if (!featuresListWrapper.classList.contains('hide')) {
            listItems.forEach((item, index) => {
              item.style.opacity = '0';
              setTimeout(() => {
                item.style.transition = 'opacity 1s ease';
                item.style.opacity = '1';
              }, index * 40); // 1.2s / 10 items = 120ms per item
            });
          } else {
            listItems.forEach((item) => {
              item.style.opacity = '0';
            });
          }
        }
        if (plusButtonIcon) {
          plusButtonIcon.classList.toggle('is-active');
        }
      });
    });
  }
};
