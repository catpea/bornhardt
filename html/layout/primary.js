export default function layout({body}) {
  return `
  <!doctype html>
  <html lang="en" data-bs-theme="dark">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Bootstrap demo</title>
      <link href="css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
      ${body}
      <script src="js/popper.min.js"></script>
      <script src="js/bootstrap.min.js"></script>
    </body>
  </html>
  `;
}
