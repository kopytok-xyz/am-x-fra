export const func_form = () => {
  const triggers = document.querySelectorAll('[top-range-trigger]');

  const checkHeightAndAddClass = () => {
    triggers.forEach((trigger) => {
      const triggerHeight = trigger.getBoundingClientRect().height;
      const viewportHeight = window.innerHeight;
      const parent = trigger.closest('[is-top-waiter]');

      if (parent && triggerHeight > 0.8 * viewportHeight) {
        parent.classList.add('is-top');
      } else if (parent) {
        parent.classList.remove('is-top');
      }
    });
  };

  // Initial check
  checkHeightAndAddClass();

  // Check height every 1 second
  setInterval(checkHeightAndAddClass, 1000);

  // Add event listener for resize
  window.addEventListener('resize', checkHeightAndAddClass);

  // Add event listener for click
  document.addEventListener('click', () => {
    const intervalId = setInterval(checkHeightAndAddClass, 100);
    setTimeout(() => clearInterval(intervalId), 1000);
  });
};
