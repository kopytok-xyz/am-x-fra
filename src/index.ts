import { func_form } from '$utils/form-height';
import { func_formLogic } from '$utils/form-logic';
import { func_geo } from '$utils/geo';
import { func_menu } from '$utils/menu';
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
});
