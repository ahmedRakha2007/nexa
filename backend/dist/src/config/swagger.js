import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const swaggerJsdoc = require("swagger-jsdoc");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Social Media API",
            version: "1.0.0",
            description: "API documentation for my social media backend",
        },
        servers: [
            {
                url: "http://localhost:3000/v1",
            },
        ],
    },
    apis: ["src/routes/*.ts"],
};
const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
//# sourceMappingURL=swagger.js.map