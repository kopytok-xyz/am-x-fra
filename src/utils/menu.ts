export const func_menu = () => {
  const menuInner = document.querySelector('.menu_inner');
  const scrollTrigger = document.querySelector('.menu_scroll-trigger');
  const sectionMenu = document.querySelector('.section_menu');
  const toggleableButton = document.querySelector('.button-can-toggle .button.is-small.is-menu');

  if (menuInner && scrollTrigger && sectionMenu) {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              menuInner.classList.remove('is-smaller');
              if (toggleableButton) {
                toggleableButton.classList.add('is-secondary');
              }
            } else {
              menuInner.classList.add('is-smaller');
              if (toggleableButton) {
                toggleableButton.classList.remove('is-secondary');
              }
            }
          });
        });

        observer.observe(scrollTrigger);
      } else {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              sectionMenu.classList.add('is-visible');
              if (toggleableButton) {
                toggleableButton.classList.remove('is-secondary');
              }
            } else {
              sectionMenu.classList.remove('is-visible');
              if (toggleableButton) {
                toggleableButton.classList.add('is-secondary');
              }
            }
          });
        });

        observer.observe(scrollTrigger);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    // Обработка кликов по ссылкам в .menu_nav при малых размерах экрана
    const menuNav = document.querySelector('.menu_nav');
    if (menuNav) {
      menuNav.addEventListener('click', (event) => {
        if (window.innerWidth < 768) {
          const target = event.target as HTMLElement;
          if (target.tagName === 'A' || target.closest('a')) {
            const menuClickArea = document.querySelector('.menu_click-areaa');
            if (menuClickArea) {
              // Симуляция клика по .menu_click-areaa
              (menuClickArea as HTMLElement).click();
            }
          }
        }
      });
    }
  }
};
