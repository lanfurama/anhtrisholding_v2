import { ViewTransition, type ReactNode } from "react";

/** Hiệu ứng "Mờ dần" khi chuyển trang (View Transitions). Header được neo cố định trong globals.css. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
