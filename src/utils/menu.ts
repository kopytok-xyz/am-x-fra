export const func_menu = () => {
  const menuInner = document.querySelector('.menu_inner');
  const scrollTrigger = document.querySelector('.menu_scroll-trigger');

  if (menuInner && scrollTrigger) {
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
        menuInner.classList.remove('is-smaller');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
  }
};
