export const func_form = () => {
  const triggers = document.querySelectorAll('[top-range-trigger]');

  const checkHeightAndAddClass = () => {
    triggers.forEach((trigger) => {
      const triggerHeight = trigger.getBoundingClientRect().height;
      const viewportHeight = window.innerHeight;
      const parent = trigger.closest('[is-top-waiter]');

      if (parent && triggerHeight > 0.6 * viewportHeight) {
        parent.classList.add('is-top');
      } else if (parent) {
        parent.classList.remove('is-top');
      }
    });
  };

  // Initial check
  checkHeightAndAddClass();

  // Check height every 0.5 seconds
  setInterval(checkHeightAndAddClass, 500);

  // Add event listener for resize
  window.addEventListener('resize', checkHeightAndAddClass);
};
