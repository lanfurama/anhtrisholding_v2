"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes, SINGLETONS } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const singletonTypes = new Set<string>(SINGLETONS);
const singletonActions = new Set(["publish", "discardChanges", "restore"]);
// Yêu cầu báo giá chỉ đến từ form liên hệ — không tạo tay trong Studio
const noCreateTypes = new Set<string>([...SINGLETONS, "quoteRequest"]);

export default defineConfig({
  name: "anhtris",
  title: "AnhTris Holdings",
  basePath: "/studio",
  projectId: projectId || "missing-project-id",
  dataset,
  schema: {
    types: schemaTypes,
    // Singleton và yêu cầu báo giá không xuất hiện trong menu "Tạo mới"
    templates: (templates) => templates.filter(({ schemaType }) => !noCreateTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType) ? input.filter(({ action }) => action && singletonActions.has(action)) : input,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
