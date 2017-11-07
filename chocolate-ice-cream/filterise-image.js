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
    elementsToHide: document.querySelectorAll(`body > div > *:not(${selectorRoot}-target), picture`),
    target: document.querySelector(`${selectorRoot}-target`),
    targetClose: document.querySelector(`${selectorRoot}-target-close`),
    targetHeading: document.querySelector(`${selectorRoot}-target-heading`),
    trigger: document.querySelector(`${selectorRoot}-trigger`),
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
    DOM.target.classList.add(stateHook);
    DOM.trigger.setAttribute('disabled', '');
    applyARIA();
    bindDocumentEvents();
    bindCloseTargetEvents();
  }

  function closeFiltersMobile() {
    DOM.target.setAttribute('hidden', '');
    DOM.target.classList.remove(stateHook);
    DOM.trigger.removeAttribute('disabled');
    DOM.trigger.focus();
    removeARIA();
    unbindDocumentEvents();
    unbindCloseTargetEvents();
  }

  function onEscKey(e) {
    e.which === 27 ? closeFiltersMobile() : false;
  }

  function applyARIA() {
    DOM.target.setAttribute('role', 'dialog');
    DOM.target.setAttribute('aria-modal', true);
    DOM.target.setAttribute('aria-labelledby', DOM.targetHeading.id);
    DOM.elementsToHide.forEach(function(item) {
      item.setAttribute('aria-hidden', true);
    });
  }

  function removeARIA() {
    DOM.target.removeAttribute('role', 'dialog');
    DOM.target.removeAttribute('aria-modal', true);
    DOM.target.removeAttribute('aria-labelledby', DOM.targetHeading.id);
    DOM.elementsToHide.forEach(function(item) {
      item.removeAttribute('aria-hidden', true);
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

  function bindCloseTargetEvents() {
    DOM.targetClose.addEventListener('click', toggleFiltersMobile);
  }

  function unbindCloseTargetEvents() {
    DOM.targetClose.removeEventListener('click', toggleFiltersMobile);
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

  return isNodeInDOM(DOM.target) ? init() : null;
}

filteriseImage();
