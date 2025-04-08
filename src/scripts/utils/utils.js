import he from 'he';

/**
 * HTML decode and strip HTML.
 * @param {string|object} html html.
 * @returns {string} html value.
 */
export const purifyHTML = (html) => {
  if (typeof html !== 'string') {
    return '';
  }

  let text = he.decode(html);
  const div = document.createElement('div');
  div.innerHTML = text;
  text = div.textContent || div.innerText || '';

  return text;
};
