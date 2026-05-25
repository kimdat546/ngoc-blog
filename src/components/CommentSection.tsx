'use client';

import { useCallback, useEffect, useState } from 'react';
import CommentForm from './CommentForm';
import { formatDateVN, maskEmail } from '@/lib/format';

interface Comment {
  id: string;
  name: string | null;
  email: string | null;
  content: string;
  created_at: string;
}

interface Props {
  postSlug: string;
  postId: string;
  postTitle: string;
}

export default function CommentSection({ postSlug, postId, postTitle }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/comments?post_slug=${encodeURIComponent(postSlug)}`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      setComments(Array.isArray(data.comments) ? data.comments : []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="mt-16 pt-8 border-t border-sage/20">
      <h3 className="text-2xl font-bold text-forest mb-2">Bình luận</h3>
      <p className="text-sm text-sage mb-6">
        {loading
          ? 'Đang tải...'
          : comments.length === 0
            ? 'Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ.'
            : `${comments.length} bình luận`}
      </p>

      <div className="mb-10 rounded-2xl bg-cream/40 border border-moss/15 p-5 sm:p-6">
        <CommentForm
          postSlug={postSlug}
          postId={postId}
          postTitle={postTitle}
          onPosted={load}
        />
      </div>

      {comments.length > 0 && (
        <ul className="space-y-5">
          {comments.map((c) => {
            const isAnon = !c.name && !c.email;
            const date = formatDateVN(c.created_at);
            let header: string;
            if (isAnon) {
              header = `Anonymous - ${date}`;
            } else {
              const parts: string[] = [];
              if (c.name) parts.push(c.name);
              if (c.email) parts.push(maskEmail(c.email));
              parts.push(date);
              header = parts.join(' - ');
            }
            return (
              <li
                key={c.id}
                className="rounded-2xl bg-white border border-sage/15 p-4 sm:p-5"
              >
                <div className="text-sm font-semibold text-forest mb-2">
                  {header}
                </div>
                <p className="text-sm sm:text-base text-forest/85 leading-relaxed whitespace-pre-wrap">
                  {c.content}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
