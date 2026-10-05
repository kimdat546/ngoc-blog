'use client';

import { useRef, useState, FormEvent } from 'react';
import Turnstile, { type TurnstileHandle } from './Turnstile';

interface Props {
  postSlug: string;
  postId: string;
  postTitle: string;
  onPosted?: () => void;
}

export default function CommentForm({ postSlug, postId, postTitle, onPosted }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          content,
          postSlug,
          postId,
          postTitle,
          website,
          turnstileToken,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Không thể gửi bình luận');
      }
      setSuccess('Cảm ơn bạn đã chia sẻ ♥️');
      setName('');
      setEmail('');
      setContent('');
      onPosted?.();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      setTimeout(() => setError(''), 5000);
    } finally {
      // Turnstile tokens are single-use, so get a fresh one for the next submit.
      turnstileRef.current?.reset();
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          placeholder="Tên của bạn (không bắt buộc)"
          className="w-full px-4 py-3 rounded-lg bg-white border border-sage/30 text-forest placeholder-sage/70 focus:outline-none focus:ring-2 focus:ring-moss/40 transition-all"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={254}
          placeholder="Email (không bắt buộc)"
          className="w-full px-4 py-3 rounded-lg bg-white border border-sage/30 text-forest placeholder-sage/70 focus:outline-none focus:ring-2 focus:ring-moss/40 transition-all"
        />
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        maxLength={2000}
        placeholder="Chia sẻ cảm nhận của bạn..."
        className="w-full px-4 py-3 rounded-lg bg-white border border-sage/30 text-forest placeholder-sage/70 focus:outline-none focus:ring-2 focus:ring-moss/40 transition-all resize-none"
      />

      <Turnstile ref={turnstileRef} onToken={setTurnstileToken} />

      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-sage">{content.length}/2000</span>
        <button
          type="submit"
          disabled={submitting || !content.trim() || !turnstileToken}
          className="btn-forest disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
      </div>

      {success && <div className="text-sm text-moss font-medium">{success}</div>}
      {error && <div className="text-sm text-red-600 font-medium">{error}</div>}
    </form>
  );
}
