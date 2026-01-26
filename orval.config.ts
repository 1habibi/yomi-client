import { defineConfig } from "orval";

export default defineConfig({
  yomi: {
    input: {
      target: "http://localhost:3000/api-json",
    },
    output: {
      mode: "tags-split",
      target: "./src/shared/api/generated",
      schemas: "./src/shared/api/generated/model",
      client: "react-query",
      mock: false,
      prettier: true,
      override: {
        mutator: {
          path: "./src/shared/mutator.ts",
          name: "customInstance",
        },
      },
    },
    hooks: {},
  },
});
