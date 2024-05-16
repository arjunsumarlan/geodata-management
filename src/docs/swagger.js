const swaggerJSDoc = require("swagger-jsdoc");
const YAML = require("yamljs");
const path = require("path");

// Load components from external YAML file
const components = YAML.load(path.resolve(__dirname, "components.yaml"));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GeoData Management System API",
      version: "1.0.0",
      description: "API Documentation for GeoData Management System",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "Operations related to user authentication",
      },
      {
        name: "GeoData",
        description: "Operations related to GeoJSON data",
      },
      {
        name: "Users",
        description: "Operations related to user management",
      },
    ],
    components: components.components,
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ["./src/pages/api/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
