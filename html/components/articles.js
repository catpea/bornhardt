/**
 * Renders a "Users" page as a JavaScript template literal.
 * @param {Object[]} users - Array of user objects with .name and .email
 * @returns {string}
 */
export default function renderArticlesTemplate({articles}, {active}) {
  console.log(articles)

  return `<div class="list-group shadow">

    ${articles.map(article => `
      <a href="${article.name}" class="list-group-item list-group-item-action ${active==article.name?'active':''}" aria-current="true">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${article.name}</h5>
          <small><time-ago datetime="${article.updated}"></time-ago></small>
        </div>
        <p class="mb-1">Some placeholder content in a paragraph.</p>
        <small>And some small print.</small>
      </a>`
      ).join('\n  ')}


  </div>


  `

}
