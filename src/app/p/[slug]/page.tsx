import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ensureSeed, getPlace, similarPlaces } from "@/lib/queries";
import { money, priceLevel, updatedLabel } from "@/lib/format";
import { toArabicDigits, TYPES } from "@/lib/constants";
import SimilarCard from "@/components/similar-card";
import { BackLink, BookingCard, Gallery, MenuPicker, ShareButton } from "@/components/place-detail-client";
import { Clock, Pin, Star } from "@/components/icons";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  await ensureSeed();
  const place = await getPlace(slug).catch(() => null);
  if (!place) return { title: "المكان مش موجود" };
  return {
    title: `${place.name} — ${place.area}`,
    description: `${place.type} في ${place.area}. متوسط الفرد ${money(place.avgPrice)} ج · ${place.address}. منيو بأسعاره، ريل، خريطة، وحجز واتساب.`,
    openGraph: {
      title: `${place.name} · خروجة`,
      description: `${place.area} — من ${money(place.avgPrice)} ج للفرد`,
      images: place.imageUrl ? [{ url: place.imageUrl }] : undefined,
      type: "article",
    },
  };
}

export default async function PlacePage({ params }: Params) {
  const { slug } = await params;
  await ensureSeed();
  const place = await getPlace(slug).catch(() => null);
  if (!place) notFound();

  const similar = await similarPlaces(place).catch(() => []);
  const level = priceLevel(place.avgPrice);
  const emoji = TYPES.find((t) => t.id === place.type)?.emoji ?? "📍";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: place.name,
    description: place.notes ?? undefined,
    image: place.imageUrl ?? undefined,
    servesCuisine: place.type,
    address: { "@type": "PostalAddress", streetAddress: place.address, addressLocality: place.area, addressCountry: "EG" },
    priceRange: `${level.symbol}`,
    aggregateRating: place.rating ? { "@type": "AggregateRating", ratingValue: place.rating, bestRating: 5 } : undefined,
    telephone: place.whatsapp ? `+${place.whatsapp}` : undefined,
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: {
        "@type": "MenuSection",
        name: "المنيو",
        hasMenuItem: place.menuItems.map((m) => ({
          "@type": "MenuItem",
          name: m.name,
          offers: { "@type": "Offer", price: m.price, priceCurrency: "EGP" },
        })),
      },
    },
  };

  return (
    <article className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BackLink />
        <div className="flex items-center gap-2">
          <ShareButton place={place} />
        </div>
      </div>

      {/* رأس الصفحة */}
      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="rounded-full bg-spice/12 px-3 py-1.5 text-spice">{emoji} {place.type}</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-inksoft">
            <Pin width={14} height={14} /> {place.area}
          </span>
          {place.rating > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-saffron/15 px-3 py-1.5 text-saffron">
              <Star width={14} height={14} fill="currentColor" stroke="none" /> {toArabicDigits(place.rating.toFixed(1))}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-surface2 px-3 py-1.5 text-muted">
            <Clock width={14} height={14} /> {place.hours ?? "المواعيد مش متاحة"}
          </span>
          <span className="rounded-full bg-mint/12 px-3 py-1.5 text-mint">{updatedLabel(place.updatedAt)}</span>
        </div>

        <h1 className="mt-3 font-display text-[clamp(2rem,7vw,3.4rem)] font-bold leading-tight">
          <span className="line-mask"><span>{place.name}</span></span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted sm:text-base">{place.address}</p>
      </header>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-8">
          <Gallery place={place} />

          <section>
            <h2 className="font-display text-xl font-bold">عن المكان</h2>
            {place.notes ? (
              <p className="mt-3 rounded-[22px] border border-line bg-surface p-5 text-sm leading-8 text-inksoft">{place.notes}</p>
            ) : (
              <p className="mt-3 rounded-[22px] border border-dashed border-line p-5 text-sm text-muted">
                لسه مضيفناش وصف للمكان ده — بس المنيو والأسعار والموقع محدّثين تحت.
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
                {place.moods.map((m) => (
                  <Link key={m} href={`/?mood=${encodeURIComponent(m)}`} className="rounded-xl bg-mint/12 px-3 py-1.5 text-xs font-bold text-mint transition-transform hover:scale-105">
                    {m}
                  </Link>
                ))}
              {place.tags.map((t) => (
                <span key={t} className="rounded-xl border border-line px-3 py-1.5 text-xs font-bold text-inksoft">{t}</span>
              ))}
            </div>
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="font-display text-xl font-bold">المنيو وأسعاره</h2>
              <p className="text-xs text-muted">دوس على الصنف عشان تحسبه في الإجمالي</p>
            </div>
            <div className="mt-3">
              <MenuPicker place={place} />
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold">توصله إزاي؟</h2>
            <div className="pattern mt-3 relative overflow-hidden rounded-[26px] border border-line bg-surface2 p-6">
              <div className="relative flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-spice text-spiceink">
                    <Pin width={24} height={24} />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold">{place.area}</p>
                    <p className="max-w-sm text-sm leading-6 text-muted">{place.address}</p>
                  </div>
                </div>
                <a
                  href={place.mapsUrl ?? "#"}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-bg transition-transform hover:scale-[1.03] active:scale-95"
                >
                  افتح في خرائط جوجل
                </a>
              </div>
            </div>
          </section>
        </div>

        <BookingCard place={place} />
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="font-display text-2xl font-bold">أماكن ممكن تعجبك برضه</h2>
            <Link href={`/?area=${encodeURIComponent(place.area)}`} className="link-underline text-sm font-bold text-spice">
              كل أماكن {place.area} ←
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p, i) => (
              <SimilarCard key={p.slug} place={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

