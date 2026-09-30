import type { Project } from "@/lib/types";
import { FadeImage } from "./effects";

/** Ảnh dự án, hoặc khung sọc chờ ảnh (như bản thiết kế) khi CMS chưa có ảnh. */
export function ProjectMedia({
  project,
  className,
  tone,
  sizes,
}: {
  project: Project;
  className: string;
  tone: "purple" | "orange" | "dark";
  sizes: string;
}) {
  if (project.image) {
    return (
      <div className={className}>
        <FadeImage src={project.image.url} alt={project.image.alt || project.title} fill sizes={sizes} />
      </div>
    );
  }
  const ph = tone === "orange" ? "phOrange" : tone === "dark" ? "phDark" : "phPurple";
  return (
    <div className={`${className} placeholder ${ph}`} role="img" aria-label={project.title}>
      ảnh {project.title}
    </div>
  );
}
