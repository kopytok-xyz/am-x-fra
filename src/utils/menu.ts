export const func_menu = () => {
  const menuInner = document.querySelector('.menu_inner');
  const scrollTrigger = document.querySelector('.menu_scroll-trigger');
  const sectionMenu = document.querySelector('.section_menu');

  if (menuInner && scrollTrigger && sectionMenu) {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              menuInner.classList.remove('is-smaller');
            } else {
              menuInner.classList.add('is-smaller');
            }
          });
        });

        observer.observe(scrollTrigger);
      } else {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              sectionMenu.classList.add('is-visible');
            } else {
              sectionMenu.classList.remove('is-visible');
            }
          });
        });

        observer.observe(scrollTrigger);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
  }
};
