/**
 * TODO:
 * -> Trap focus in modal.
 * -> Detect large layout media query and make relevant changes.
 * -> Do not dull out the image when mobile filters modal is open.
 * -> Util func for applying attributes.
 */

function isNodeInDOM(node) {
  return node && node === document.body ? false : document.body.contains(node);
}

function filters() {
  /**
   * All fuctions appended with "Mobile" only apply to small viewports.
   */

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
  };

  function applyFilters() {
    const unit = this.dataset.unit || '';
    document.documentElement.style.setProperty(`--${this.id}`, `${this.value}${unit}`);
  }

  function toggleFiltersMobile() {
    DOM.filters.hidden ? openFiltersMobile() : closeFiltersMobile();
  }

  function openFiltersMobile() {
    DOM.filters.removeAttribute('hidden');
    DOM.filters.classList.add(stateHook);
    DOM.mobileTrigger.setAttribute('disabled', '');
    DOM.filters.focus();
    applyAriaMobile();
    bindDocumentEventsMobile();
    bindCloseTargetEventsMobile();
  }

  function closeFiltersMobile() {
    DOM.filters.setAttribute('hidden', '');
    DOM.filters.classList.remove(stateHook);
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
    const elements = DOM.filters.querySelectorAll(DOM.filtersFocusableElements);

    if (!elements) return null;

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];
    const activeElement = document.activeElement;

    if (activeElement === lastElement) {
      //firstElement.focus();
      console.log('Last item is focused!');
    }

    console.log(activeElement, e);
  }

  function bindFilterEvents() {
    if (!DOM.filter) return null;

    DOM.filter.forEach(function(item) {
      item.addEventListener(item.type === 'range' ? 'input' : 'change', applyFilters);
    });
  }

  function bindTriggerEventsMobile() {
    if (!DOM.mobileTrigger) return null;

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
}

filters();
