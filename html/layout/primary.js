
export default function layout({top="", breadcrumb="", navigation="", aside="", body="", component="", user1="", user2="", user3="", user4="",}) {
  return `
  <!doctype html>
  <html lang="en" data-bs-theme="dark">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>MikiMikiMeowMeow &middot; bornhardt edition</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💎</text></svg>">
      <link href="/css/bootstrap.min.css" rel="stylesheet">
      <link href="/css/icons/bootstrap-icons.min.css" rel="stylesheet">
    </head>
    <body>


    <header class="py-3 mb-3 border-bottom">
      <div class="container-fluid d-grid gap-3 align-items-center" style="grid-template-columns: 1fr 2fr;">
        <div class="dropdown">
            <a href="#" class="d-flex align-items-center col-lg-4 mb-2 mb-lg-0 link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Bootstrap menu">
              <i class="bi bi-gem me-2"></i> MikiMiki
            </a>
          <ul class="dropdown-menu text-small shadow">
            <li><a class="dropdown-item active" href="#" aria-current="page">Overview</a></li>
            <li><a class="dropdown-item" href="#">Inventory</a></li>
            <li><a class="dropdown-item" href="#">Customers</a></li>
            <li><a class="dropdown-item" href="#">Products</a></li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="#">Reports</a></li>
            <li><a class="dropdown-item" href="#">Analytics</a></li>
          </ul>
        </div>
        <div class="d-flex align-items-center">
          <form class="w-100 me-3" role="search"> <input type="search" class="form-control" placeholder="Search..." aria-label="Search"> </form>
          <div class="flex-shrink-0 dropdown"> <a href="#" class="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"> <img src="avatar.png" alt="mdo" width="32" height="32" class="rounded-circle"> </a>
            <ul class="dropdown-menu text-small shadow">
              <li><a class="dropdown-item" href="#">New project...</a></li>
              <li><a class="dropdown-item" href="#">Settings</a></li>
              <li><a class="dropdown-item" href="#">Profile</a></li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li><a class="dropdown-item" href="#">Sign out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <div class="container-fluid pb-3">
      <div class="d-grid gap-3" style="grid-template-columns: 1fr 2fr;">
        <div> ${navigation} </div>
        <div> ${body} </div>
      </div>
    </div>


      <script src="/js/popper.min.js"></script>
      <script src="/js/bootstrap.bundle.min.js"></script>
    </body>
  </html>
  `;
}
