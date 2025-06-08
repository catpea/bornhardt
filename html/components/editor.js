/**
 * Renders a "Users" page as a JavaScript template literal.
 * @param {Object[]} users - Array of user objects with .name and .email
 * @returns {string}
 */
export default function renderEditorTemplate({name, text, language="markdown", updated}) {
  return `<feed-face language="${language}">${text}</feed-face>`
}
