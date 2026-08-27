type ReviewItem = { id: string; rating: number; comment: string | null; createdAt: Date; customer: { name: string } };

export function ReviewList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) return <p className="mt-4 text-sm text-slate-500">No reviews yet.</p>;
  return <div className="mt-5 space-y-4">{reviews.map((review) => <article key={review.id} className="border-t border-slate-100 pt-4"><div className="flex justify-between gap-3"><span className="text-amber-500" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span><time className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</time></div><p className="mt-1 text-sm font-semibold text-slate-700">{review.customer.name}</p>{review.comment ? <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{review.comment}</p> : null}</article>)}</div>;
}
