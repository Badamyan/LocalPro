import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LogoutButton } from '@/components/auth/logout-button';
import { BookingActions } from '@/components/marketplace/booking-actions';
import { ReviewForm } from '@/components/marketplace/review-form';
import { NotificationsList } from '@/components/marketplace/notification-list';
import { prisma } from '@/lib/prisma';
import { getBookings } from '@/services/booking-service';
import { getNotifications } from '@/services/notification-service';
import { getProviderReviewSummary } from '@/services/review-service';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role === 'ADMIN') redirect('/');
  const bookings = await getBookings(session.user.id, session.user.role);
  const notifications = await getNotifications(session.user.id);
  const providerProfile = session.user.role === 'PROVIDER'
    ? await prisma.providerProfile.findUnique({ where: { userId: session.user.id }, include: { services: { orderBy: { updatedAt: 'desc' } } } })
    : null;
  const providerSummary = providerProfile ? await getProviderReviewSummary(providerProfile.id) : null;

  return (
    <main className="dashboard-page py-16">
      <div className="dashboard-shell container-shell rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-slate-600">Welcome back, {session.user.name}.</p>
          </div>
          <LogoutButton />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Role</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{session.user.role}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{session.user.email}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Authenticated</p>
          </div>
        </div>
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">{session.user.role === 'PROVIDER' ? 'Incoming requests' : 'Your activity'}</p><h2 className="mt-2 text-2xl font-bold text-slate-900">Bookings</h2></div><span className="text-sm text-slate-500">{bookings.length} total</span></div>
          <div className="mt-4 space-y-3">
            {bookings.map((booking) => <article key={booking.id} className="rounded-2xl border border-slate-200 p-5"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-start"><div><p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{booking.status}</p><h3 className="mt-1 text-lg font-bold text-slate-900">{booking.serviceListing.title}</h3><p className="mt-1 text-sm text-slate-600">{session.user.role === 'PROVIDER' ? `Customer: ${booking.customer.name}` : `Provider: ${booking.providerProfile.businessName}`}</p><p className="mt-1 text-sm text-slate-500">{booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleString() : 'Time to be arranged'}{booking.totalPrice !== null ? ` · $${booking.totalPrice.toFixed(2)}` : ''}</p></div><BookingActions booking={booking} provider={session.user.role === 'PROVIDER'} /></div>{session.user.role === 'CUSTOMER' && booking.status === 'COMPLETED' ? <div className="mt-5 border-t border-slate-100 pt-4">{booking.review ? <p className="text-sm font-semibold text-brand-700">Reviewed · <span className="text-amber-500">{'★'.repeat(booking.review.rating)}</span></p> : <ReviewForm bookingId={booking.id} />}</div> : null}</article>)}
            {bookings.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-600">No bookings yet.</div> : null}
          </div>
        </section>
        <NotificationsList initialNotifications={notifications} />
        {providerProfile ? <section className="mt-10 border-t border-slate-200 pt-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Provider profile</p><h2 className="mt-2 text-2xl font-bold text-slate-900">{providerProfile.businessName}</h2><p className="mt-2 text-slate-600">{providerProfile.services.length} service listings · <a href="/provider/services" className="font-semibold text-brand-700">Manage listings</a></p><p className="mt-4 text-lg font-semibold text-slate-900"><span className="text-amber-500">★</span> {providerSummary?.averageRating.toFixed(1)} <span className="text-sm font-normal text-slate-500">from {providerSummary?.reviewCount} review{providerSummary?.reviewCount === 1 ? '' : 's'}</span></p></section> : null}
      </div>
    </main>
  );
}
