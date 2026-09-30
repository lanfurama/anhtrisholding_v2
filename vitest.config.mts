import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    // Next.js tự xử lý `import "server-only"`; trong test chỉ cần một module rỗng
    {
      name: "server-only-stub",
      resolveId: (id) => (id === "server-only" ? "\0server-only" : null),
      load: (id) => (id === "\0server-only" ? "export {};" : null),
    },
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["src/**/*.test.ts"], environment: "node" },
});
