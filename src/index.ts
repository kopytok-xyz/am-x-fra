import { symbolToElement } from '$utils/symbol-to-element';
import { tagsCards } from '$utils/tags-cards';

window.Webflow ||= [];
window.Webflow.push(() => {
  symbolToElement();
  tagsCards();
});
