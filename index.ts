// noinspection JSUnresolvedReference

import packageJSON from "./package.json"

function defaultSwaggerUIVersion() {
  return packageJSON.devDependencies["swagger-ui"]
}

function getCDN(version: string): string {
  return `https://unpkg.com/swagger-ui-dist@${version}`
}

function generateSwaggerUI(params: { swaggerDoc: object; swaggerUiVersion?: string; customOptions?: object }): string {
  const base = getCDN(params.swaggerUiVersion ?? process.env.SWAGGER_UI_VERSION ?? defaultSwaggerUIVersion())
  const swaggerDoc = params.swaggerDoc
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="${base}/swagger-ui.css" >
  <style>
    html
    {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *,
    *:before,
    *:after
    {
      box-sizing: inherit;
    }

    body {
      margin: 0;
      background: #fafafa;
    }
    
    .swagger-ui .topbar .download-url-wrapper { display: none }
  </style>
</head>

<body>
<div id="swagger-ui"></div>
<script src="${base}/swagger-ui-bundle.js" crossorigin></script>
<script src="${base}/swagger-ui-standalone-preset.js" crossorigin></script>
<script>
window.onload = function() {
  const url = window.location.origin
  window.ui = SwaggerUIBundle({
    spec: ${JSON.stringify(swaggerDoc)},
    url: url,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  })
}
</script>
</body>
</html>
`
}

export { generateSwaggerUI }
