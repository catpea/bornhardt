/**
 * Renders a "Users" page as a JavaScript template literal.
 * @param {Object[]} users - Array of user objects with .name and .email
 * @returns {string}
 */
export default function renderExampleTemplate({examples}) {
  return `
    <h1>Example</h1>
    <ul id="example">
      ${examples.map(user =>
        `<li>${example.name} &lt;${example.email}&gt;</li>`
      ).join('\n  ')}
    </ul>
  `
}
