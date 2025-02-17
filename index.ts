/* eslint-disable @typescript-eslint/no-explicit-any */
// noinspection JSUnresolvedReference

import packageJSON from "./package.json"

function defaultSwaggerUIVersion() {
  return packageJSON.devDependencies["swagger-ui"]
}

function getCDN(version: string): string {
  return `https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/${version}`
}

function generateSwaggerUI(params: { swaggerDoc: object; swaggerUiVersion?: string; customOptions?: object }): string {
  const base = getCDN(params.swaggerUiVersion ?? process.env.SWAGGER_UI_VERSION ?? defaultSwaggerUIVersion())
  const options = stringify({
    swaggerDoc: params.swaggerDoc,
    customOptions: params.customOptions ?? {},
  })
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
      box-sizing: border-box
      overflow: -moz-scrollbars-vertical
      overflow-y: scroll
    }
    *,
    *:before,
    *:after
    {
      box-sizing: inherit
    }

    body {
      margin:0
      background: #fafafa
    }
  </style>
</head>

<body>
<div id="swagger-ui"></div>
<script src="${base}/swagger-ui-bundle.js"></script>
<script src="${base}/swagger-ui-standalone-preset.js"></script>
<script>
window.onload = function() {
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  ${options}
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [],
    layout: "BaseLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)
    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
</script>
</body>
</html>
`
}

/**
 * @see https://github.com/scottie1984/swagger-ui-express/blob/master/index.js
 */
function stringify(obj: any) {
  const placeholder = "____FUNCTIONPLACEHOLDER____"
  const fns: any[] = []
  let json = JSON.stringify(
    obj,
    function (_, value) {
      if (typeof value === "function") {
        fns.push(value)
        return placeholder
      }
      return value
    },
    2,
  )
  json = json.replace(new RegExp('"' + placeholder + '"', "g"), function () {
    return fns.shift()
  })
  return "var options = " + json + ";"
}

export { generateSwaggerUI }
