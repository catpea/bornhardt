/**
 * Renders a "Users" page as a JavaScript template literal.
 * @param {Object[]} users - Array of user objects with .name and .email
 * @returns {string}
 */
export default function renderArticleTemplate({name, text}) {
  return `
    <div class="card text-center">
      <div class="card-header">
        ${name}
      </div>
      <div class="card-body">
        <p class="card-text">${text}</p>
      </div>
      <div class="card-footer text-body-secondary">
        2 days ago
      </div>
    </div>
  `

}
