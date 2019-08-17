// const CssSelectorGenerator = require('css-selector-generator');
// const css = require('css-selector-tools');
import 'css-selector-tools';

// Based on https://jsfiddle.net/rFc8E/9/
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

export const addCompomnentSelectedListener = callback => {
  document.body.addEventListener('component-selected', callback);
};

export const removeComponentSelectListener = callback => {
    document.body.removeEventListener('component-selected', callback);
}