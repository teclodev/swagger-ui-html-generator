// noinspection JSUnresolvedReference
import packageJSON from "./package.json"
import { type SwaggerUIOptions } from "swagger-ui"

function defaultSwaggerUIVersion() {
  return packageJSON.devDependencies["swagger-ui"]
}

function getCDN(version: string): string {
  return `https://unpkg.com/swagger-ui-dist@${version}`
}

type GenerateSwaggerUIParams = {
  options: Pick<NonNullable<SwaggerUIOptions>, "spec"> &
    Omit<SwaggerUIOptions, "spec" | "dom_id" | "url" | "deepLinking">
  swaggerUIVersion?: string
}

const defaultPresets = "[SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset]"
const defaultPlugins = "[SwaggerUIBundle.plugins.DownloadUrl]"
const defaultLayout = "StandaloneLayout"

function generateSwaggerUI(params: GenerateSwaggerUIParams): string {
  const { swaggerUIVersion, options } = params
  const base = getCDN(swaggerUIVersion ?? process.env.SWAGGER_UI_VERSION ?? defaultSwaggerUIVersion())
  const spec = options.spec
  const layout = options.layout ?? defaultLayout
  const presets = options.presets ?? defaultPresets
  const plugins = options.plugins ?? defaultPlugins

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
    spec: ${JSON.stringify(spec)},
    url: url,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: ${presets},
    plugins: ${plugins},
    layout: "${layout}"
  })
}
</script>
</body>
</html>
`
}

export { generateSwaggerUI }
