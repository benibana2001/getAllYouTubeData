import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  return {
    define: {
      __APP_ENV__: process.env.VITE_VERCEL_ENV,
      __DEBUG__: JSON.stringify(mode === 'development')
    },
    plugins: [
      {
        name: "treat-js-files-as-jsx",
        async transform(code, id) {
          if (!id.match(/src\/.*\.ts$/)) return null;
          return transformWithEsbuild(code, id, {
            loader: "tsx",
            jsx: "automatic",
          });
        },
      },
      react(),
    ],
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    }
  }
});
