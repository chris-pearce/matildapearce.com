/**
 * TODO:
 * -> Trap focus in modal.
 * -> Detect large layout media query and make relevant changes.
 */

function isNodeInDOM(node) {
  return node === document.body ? false : document.body.contains(node);
}

function replaceTextNode(el, str) {
  return el && str ? (el.textContent = str) : false;
}

function filteriseImage() {
  /**
   * All fuctions appended with "Mobile" only apply to small viewports.
   */

  const selectorRoot = '.js-filterise-image';
  const stateHook = 'is-open';
  const DOM = {
    filters: document.querySelectorAll(`${selectorRoot}-target-filter`),
    nonTargetElements: document.querySelectorAll(
      `body > div:first-child > *:not(${selectorRoot}),
      picture`
    ),
    root: document.querySelector(selectorRoot),
    target: document.querySelector(`${selectorRoot}-target`),
    targetHeading: document.querySelector(`${selectorRoot}-target-heading`),
    trigger: document.querySelector(`${selectorRoot}-trigger`),
    triggerText: document.querySelector(`${selectorRoot}-trigger span`),
  };

  function applyFilters() {
    const unit = this.dataset.unit || '';
    document.documentElement.style.setProperty(`--${this.id}`, `${this.value}${unit}`);
  }

  function toggleFiltersMobile() {
    DOM.target.hidden ? openFiltersMobile() : closeFiltersMobile();
  }

  function openFiltersMobile() {
    DOM.target.removeAttribute('hidden');
    DOM.root.classList.add(stateHook);
    replaceTextNode(DOM.triggerText, 'Close');
    applyARIA();
    bindDocumentEvents();
  }

  function closeFiltersMobile() {
    DOM.target.setAttribute('hidden', '');
    DOM.root.classList.remove(stateHook);
    replaceTextNode(DOM.triggerText, 'Open');
    DOM.trigger.focus();
    unbindDocumentEvents();
  }

  function onEscKey(e) {
    e.which === 27 ? closeFiltersMobile() : false;
  }

  function applyARIA() {
    DOM.target.setAttribute('role', 'dialog');
    DOM.target.setAttribute('aria-modal', true);
    DOM.target.setAttribute('aria-labelledby', DOM.targetHeading.id);
    DOM.nonTargetElements.forEach(function(item) {
      item.setAttribute('aria-hidden', true);
    });
  }

  function bindFilterEvents() {
    DOM.filters.forEach(function(item) {
      item.addEventListener(item.type === 'range' ? 'input' : 'change', applyFilters);
    });
  }

  function bindTriggerEvents() {
    DOM.trigger.addEventListener('click', toggleFiltersMobile);
  }

  function bindDocumentEvents() {
    document.addEventListener('keydown', onEscKey);
  }

  function unbindDocumentEvents() {
    document.removeEventListener('keydown', onEscKey);
  }

  function init() {
    bindTriggerEvents();
    bindFilterEvents();
  }

  return isNodeInDOM(DOM.root) ? init() : false;
}

filteriseImage();
