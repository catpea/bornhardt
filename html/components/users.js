/**
 * Renders a "Users" page as a JavaScript template literal.
 * @param {Object[]} users - Array of user objects with .name and .email
 * @returns {string}
 */
export default function renderUsersTemplate({users}) {
  return `
    <h1>Users</h1>
    <ul id="users">
      ${users.map(user =>
        `<li>${user.name} &lt;${user.email}&gt;</li>`
      ).join('\n  ')}
    </ul>
  `
}
