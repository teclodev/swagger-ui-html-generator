import { generateSwaggerUI } from "@teclo/swagger-ui-html-generator"
import express from "express"

const doc = {
  openapi: "3.0.0",
  info: {
    title: "Basic API",
    description: "Simple API documentation with basic paths",
    version: "1.0.0"
  },
  paths: {
    "/users": {
      get: {
        summary: "Get a list of users",
        description: "Returns a list of users",
        responses: {
          "200": {
            description: "A list of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      name: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/{id}": {
      get: {
        summary: "Get a user by ID",
        description: "Returns a single user",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          "200": {
            description: "User object",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    name: { type: "string" }
                  }
                }
              }
            }
          },
          "404": {
            description: "User not found"
          }
        }
      }
    }
  }
}

const html = generateSwaggerUI({
  options: {
    spec: doc
  }
})

const app = express()

app.get("/docs", (req, res) => {
  res.set("Content-Type", "text/html").send(html)
})

app.listen(3000, () => console.log("listening on port 3000"))
