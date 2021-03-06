import 'css-selector-tools';

/**
 * Show a box around the element under the user's mouse while in component select mode
 * Based on https://jsfiddle.net/rFc8E/9/
 * @param {Event} e
 */
export const handleMouseMove = e => {
  let selector = document.querySelector('#selector');
  if (!selector) {
    selector = document.createElement('div');
    selector.id = 'selector';
    document.body.appendChild(selector);
  }
  const descriptors = ['top', 'bottom', 'left', 'right'];
  const elements = {};
  descriptors.forEach(desc => {
    elements[desc] = document.querySelector(`#selector-${desc}`);
    if (!elements[desc]) {
      elements[desc] = document.createElement('div');
      elements[desc].id = `selector-${desc}`;
      selector.appendChild(elements[desc]);
    }
  });

  if (
    e.target.id.indexOf('selector') !== -1 ||
    e.target.tagName === 'BODY' ||
    e.target.tagName === 'HTML'
  ) {
    console.log('selector, body, or html');
    return;
  }

  const $target = e.target;
  const targetOffset = $target.getBoundingClientRect();
  const targetHeight = targetOffset.height;
  const targetWidth = targetOffset.width;

  // top
  elements.top.style.left = `${targetOffset.left - 4}px`;
  elements.top.style.top = `${targetOffset.top - 4}px`;
  elements.top.style.width = `${targetWidth + 5}px`;
  // bottom
  elements.bottom.style.top = `${targetOffset.top + targetHeight + 1}px`;
  elements.bottom.style.left = `${targetOffset.left - 3}px`;
  elements.bottom.style.width = `${targetWidth + 4}px`;
  // left
  elements.left.style.left = `${targetOffset.left - 5}px`;
  elements.left.style.top = `${targetOffset.top - 4}px`;
  elements.left.style.height = `${targetHeight + 8}px`;
  // right
  elements.right.style.left = `${targetOffset.left + targetWidth + 1}px`;
  elements.right.style.top = `${targetOffset.top - 4}px`;
  elements.right.style.height = `${targetHeight + 8}px`;
};

/**
 * Emit CustomEvent 'component-selected' when the user clicks while in component select mode
 * @event CustomEvent
 * @param {Event} e 
 */
export const handleMouseClick = e => {
  e.preventDefault();
  console.log(e.target);
  console.log(e.target.getSelector());
  const selector = e.target.getSelector();

  const componentSelectedEvent = new CustomEvent('component-selected', {
    detail: {
      selector,
    },
  });
  document.body.dispatchEvent(componentSelectedEvent);
};

/**
 * Attempt to replace the auto-generated selector with a more robust one
 * @param {string} selector 
 */
export const sanitizeSelector = selector => {
    let sanitized = selector;
    // Replace absolute URLs with relative ones
    const absoluteUrlsRegex = /href="https?:\/\/[\w.-]+\/(.*)/;
    if (selector.match(absoluteUrlsRegex)) {
        sanitized = sanitized.replace(absoluteUrlsRegex, 'href*=/$1');
        console.log('replaced absolute urls in selector [before, after]', selector, sanitized);
    }
    return sanitized;
};
