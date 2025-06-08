/**
 * Renders a "Users" page as a JavaScript template literal.
 * @param {Object[]} users - Array of user objects with .name and .email
 * @returns {string}
 */
export default function renderArticleTemplate({name, text, updated}) {
  return `
    <div class="card text-center shadow">
      <div class="card-header">

        <div class="dropdown d-inline-block">

          <a href="#" class="link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Bootstrap menu">
            ${name}
          </a>

          <ul class="dropdown-menu text-small shadow">
            <li><a class="dropdown-item active" href="#" aria-current="page">Overview</a></li>
            <li><a class="dropdown-item" href="#">Edit</a></li>
            <li><a class="dropdown-item" href="#">Customers</a></li>
            <li><a class="dropdown-item" href="#">Products</a></li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="#">Reports</a></li>
            <li><a class="dropdown-item" href="#">Analytics</a></li>
          </ul>
        </div>

        <a href="/edit/${name}" target="editor" class="btn btn-outline-secondary btn-sm float-end">edit</a>

      </div>
      <div class="card-body">
        <p class="card-text">${text}</p>
      </div>
      <div class="card-footer text-body-secondary">
        <time-ago datetime="${updated}"></time-ago>
      </div>
    </div>
  `

}
