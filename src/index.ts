import { func_form } from '$utils/form-height';
import { func_formLogic } from '$utils/form-logic';
import { func_geo } from '$utils/geo';
import { func_heroInteractionText } from '$utils/hero-interaction-text';
import { func_menu } from '$utils/menu';
import { func_pluralTags } from '$utils/plural-tags-partner';
import { symbolToElement } from '$utils/symbol-to-element';
import { tagsCards } from '$utils/tags-cards';

window.Webflow ||= [];
window.Webflow.push(() => {
  symbolToElement();
  tagsCards();
  func_menu();
  func_form();
  func_formLogic();
  func_geo();
  func_heroInteractionText();
  func_pluralTags();
});
