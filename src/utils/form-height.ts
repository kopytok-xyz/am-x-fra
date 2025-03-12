export const func_form = () => {
  const allTriggers = document.querySelectorAll('[top-range-trigger]');

  if (allTriggers.length) {
    allTriggers.forEach((trigger) => {
      const parent = trigger.parentElement;
      if (!parent) return;

      const breakpointTop0 = parseFloat(parent.getAttribute('breakpoint-top-0')) || 0;
      const breakpointTop768 = parseFloat(parent.getAttribute('breakpoint-top-768')) || 0;

      const calculateDistanceInRem = () => {
        const rect = trigger.getBoundingClientRect();
        const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const distanceTopInRem = rect.top / remSize;
        const distanceBottomInRem = (window.innerHeight - rect.bottom) / remSize;

        const threshold = window.innerWidth < 768 ? breakpointTop0 : breakpointTop768;

        const conditionMet = distanceTopInRem <= threshold && distanceBottomInRem <= threshold;

        if (conditionMet) {
          parent.classList.add('is-top');
        } else {
          parent.classList.remove('is-top');
        }
      };

      // Initial calculation
      calculateDistanceInRem();

      // Add event listeners to recalculate on scroll and resize
      window.addEventListener('scroll', calculateDistanceInRem);
      window.addEventListener('resize', calculateDistanceInRem);
    });
  } else {
    console.log('No triggers found.');
  }
};
