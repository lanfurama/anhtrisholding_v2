import Link from "next/link";
import type { PostCard as PostCardData } from "@/lib/types";
import { formatDate, postPath } from "@/lib/routes";
import { FadeImage } from "./effects";

export function PostCard({ post, showCategory = false }: { post: PostCardData; showCategory?: boolean }) {
  return (
    <Link href={postPath(post.slug)} className="postCard">
      <div className="postMedia">
        {post.coverImage && (
          <FadeImage src={post.coverImage.url} alt={post.coverImage.alt || post.title} fill sizes="(max-width: 700px) 100vw, 400px" />
        )}
      </div>
      <div className="postBody">
        <span className="postMeta">
          {showCategory && `${post.category} · `}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </span>
        <span className="postTitle">{post.title}</span>
        <span className="postLede">{post.excerpt}</span>
      </div>
    </Link>
  );
}
