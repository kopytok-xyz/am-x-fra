export const func_pluralTags = () => {
  // Находим все теги для клонирования
  const all_pluralTags = document.querySelectorAll('[partner-tag-to-clone]');

  if (all_pluralTags.length) {
    // Находим все блоки, ожидающие клонированные теги
    const all_tagWaiters = document.querySelectorAll('[partner-tag-clone-waiter]');

    // Для каждого блока-получателя
    all_tagWaiters.forEach((waiter) => {
      // Получаем список требуемых тегов из атрибута
      const requiredTags =
        waiter
          .getAttribute('partner-tag-clone-waiter')
          ?.split(',')
          .map((tag) => tag.trim()) || [];

      // Для каждого требуемого тега
      requiredTags.forEach((tagName) => {
        // Ищем соответствующий тег для клонирования
        const sourceTag = Array.from(all_pluralTags).find(
          (tag) => tag.getAttribute('partner-tag-to-clone') === tagName
        );

        // Если нашли исходный тег, клонируем его
        if (sourceTag) {
          const clonedTag = sourceTag.cloneNode(true);
          waiter.appendChild(clonedTag);
        }
      });
    });
  }
};
