/**
 * NOTE:
 * -> All fuctions appended with "Mobile" only apply to small viewports.
 *
 * TODO:
 * -> Use the `matchMedia()` method alongside the `resize` event to determine
 *    when the viewport is wider than "Mobile" so that all of the ARIA that is
 *    only applicable at "Mobile" can be removed. Ideally read the breakpoint
 *    from the CSS.
 * -> Add a filters reset button.
 */

(function filters() {
  let focusableElements;
  const selectorRoot = '.js-filters';
  const stateHook = 'is-open';
  const DOM = {
    elementsToHideOnFiltersOpen: document.querySelectorAll(`body > div > *:not(${selectorRoot}), picture`),
    filter: document.querySelectorAll(`${selectorRoot}-filter`),
    filters: document.querySelector(selectorRoot),
    filtersClose: document.querySelector(`${selectorRoot}-close`),
    filtersFocusableElements: [
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      '[contenteditable]',
      '[tabindex]:not([tabindex^="-"])',
    ],
    filtersHeading: document.querySelector(`${selectorRoot}-heading`),
    mobileTrigger: document.querySelector(`${selectorRoot}-mobile-trigger`),
    root: document.body,
  };

  function applyFilters() {
    const unit = this.dataset.unit || '';
    document.documentElement.style.setProperty(`--${this.id}`, `${this.value}${unit}`);
  }

  function toggleFiltersMobile() {
    DOM.filters.hidden ? openFiltersMobile() : closeFiltersMobile();
  }

  function openFiltersMobile() {
    focusableElements = DOM.filters.querySelectorAll(DOM.filtersFocusableElements);

    DOM.root.classList.add(stateHook);
    DOM.filters.classList.add(stateHook);
    DOM.filters.removeAttribute('hidden');
    DOM.mobileTrigger.setAttribute('disabled', '');

    // Set focus to first focusable element, fallback to the container
    if (focusableElements) {
      focusableElements[0].focus();
    } else {
      DOM.filters.focus();
    }

    applyAriaMobile();
    bindDocumentEventsMobile();
    bindCloseTargetEventsMobile();
  }

  function closeFiltersMobile() {
    DOM.root.classList.remove(stateHook);
    DOM.filters.classList.remove(stateHook);
    DOM.filters.setAttribute('hidden', '');
    DOM.mobileTrigger.removeAttribute('disabled');
    DOM.mobileTrigger.focus();

    removeAria();
    unbindDocumentEventsMobile();
    unbindCloseTargetEventsMobile();
  }

  function handleDocumentKeyCodes(e) {
    switch (e.keyCode || e.key) {
      // Esc key
      case 27 || 'escape':
        closeFiltersMobile();
        break;
      // Tab key
      case 9 || 'tab':
        trapFocusMobile(e);
        break;
    }
  }

  function applyAriaMobile() {
    DOM.filters.setAttribute('role', 'dialog');
    DOM.filters.setAttribute('aria-modal', true);
    DOM.filters.setAttribute('aria-labelledby', DOM.filtersHeading.id);
    DOM.elementsToHideOnFiltersOpen.forEach(function(item) {
      item.setAttribute('aria-hidden', true);
    });
  }

  function removeAria() {
    DOM.filters.removeAttribute('role', 'dialog');
    DOM.filters.removeAttribute('aria-modal', true);
    DOM.filters.removeAttribute('aria-labelledby', DOM.filtersHeading.id);
    DOM.elementsToHideOnFiltersOpen.forEach(function(item) {
      item.removeAttribute('aria-hidden', true);
    });
  }

  function trapFocusMobile(e) {
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    // On "Shift + Tab" if current focused element is first then go to last
    if (e.shiftKey && activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
      // On "Tab" if current focused element is last then go to first
    } else if (!e.shiftKey && activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }

  function bindFilterEvents() {
    DOM.filter.forEach(function(item) {
      item.addEventListener(item.type === 'range' ? 'input' : 'change', applyFilters);
    });
  }

  function bindTriggerEventsMobile() {
    DOM.mobileTrigger.addEventListener('click', toggleFiltersMobile);
  }

  function bindCloseTargetEventsMobile() {
    DOM.filtersClose.addEventListener('click', toggleFiltersMobile);
  }

  function unbindCloseTargetEventsMobile() {
    DOM.filtersClose.removeEventListener('click', toggleFiltersMobile);
  }

  function bindDocumentEventsMobile() {
    document.addEventListener('keydown', handleDocumentKeyCodes);
  }

  function unbindDocumentEventsMobile() {
    document.removeEventListener('keydown', handleDocumentKeyCodes);
  }

  function init() {
    bindTriggerEventsMobile();
    bindFilterEvents();
  }

  return DOM.filters ? init() : null;
})();
