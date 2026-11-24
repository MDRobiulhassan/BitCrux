import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const featureBoundaryPlugin = {
  rules: {
    "no-cross-feature-deep-import": {
      meta: {
        type: "problem",
        docs: {
          description:
            "Prevent importing another feature's internals instead of its public entry point",
        },
        schema: [],
        messages: {
          crossFeature:
            "Import cross-feature components through that feature's public entry point. Direct action and type imports are allowed.",
        },
      },
      create(context) {
        const sourceFile = context.getFilename().replaceAll("\\", "/");
        const ownerFeature = sourceFile.match(/\/src\/features\/([^/]+)\//)?.[1];

        if (!ownerFeature) {
          return {};
        }

        function checkImport(node) {
          const importPath = node.source?.value;

          if (typeof importPath !== "string" || node.importKind === "type") {
            return;
          }

          const importedFeature = importPath.match(
            /^@\/features\/([^/]+)\/(.+)$/,
          );

          if (
            !importedFeature ||
            importedFeature[1] === ownerFeature ||
            importedFeature[2].startsWith("actions/")
          ) {
            return;
          }

          context.report({
            node: node.source,
            messageId: "crossFeature",
          });
        }

        return {
          ImportDeclaration: checkImport,
          ExportNamedDeclaration: checkImport,
          ExportAllDeclaration: checkImport,
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/features/**/*.{ts,tsx}"],
    plugins: {
      "feature-boundaries": featureBoundaryPlugin,
    },
    rules: {
      "feature-boundaries/no-cross-feature-deep-import": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
