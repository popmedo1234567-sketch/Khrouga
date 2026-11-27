import Link from "next/link";
import { Logo, WhatsApp } from "./icons";

const COLS = [
  {
    title: "التطبيق",
    links: [
      { href: "/", label: "استكشف الأماكن" },
      { href: "/?view=favorites", label: "المفضلة" },
      { href: "/?sort=new", label: "أحدث الأسعار" },
      { href: "/admin", label: "لوحة الأدمن" },
    ],
  },
  {
    title: "مناطق مشهورة",
    links: [
      { href: "/?area=الزمالك", label: "الزمالك" },
      { href: "/?area=المعادي", label: "المعادي" },
      { href: "/?area=التجمع الخامس", label: "التجمع الخامس" },
      { href: "/?area=وسط البلد", label: "وسط البلد" },
    ],
  },
  {
    title: "أجواء",
    links: [
      { href: "/?mood=رومانسي", label: "خروجة رومانسي" },
      { href: "/?mood=شلة", label: "لمة الشلة" },
      { href: "/?mood=عائلي", label: "خروجة عائلية" },
      { href: "/?mood=هادي", label: "قعدة هادية" },
    ],
  },
];

export default function SiteFooter() {
  const contact = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP?.replace(/\D/g, "");
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-surface2">
      <div className="pattern pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-spice to-saffron text-spiceink">
                <Logo width={26} height={26} />
              </span>
              <div>
                <p className="font-display text-2xl font-semibold leading-none">خروجة</p>
                <p className="mt-1 text-xs tracking-[0.25em] text-muted">KHROUGA · CAIRO</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-inksoft">
              بنجمعلك الأماكن والمنيو والأسعار في مكان واحد عشان تختار بسهولة. الأسعار تقريبية وممكن تتغيّر؛ اتأكد من المكان قبل الحجز. لو لقيت معلومة مش مظبوطة، بلّغنا.
            </p>
            {contact && (
              <a
                href={`https://wa.me/${contact}?text=${encodeURIComponent("عايز أقترح مكان على خروجة")}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03] active:scale-95"
              >
                <WhatsApp width={18} height={18} /> اقترح مكان
              </a>
            )}
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-semibold text-muted">{col.title}</h3>
              <ul className="mt-4 space-y-1">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline inline-block py-1.5 text-sm font-semibold text-inksoft hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} خروجة — اتعمل بحب في القاهرة 🇪🇬</p>
          <p>
            الصور والريلات التجريبية من{" "}
            <a href="https://www.pexels.com" target="_blank" rel="noreferrer noopener" className="link-underline font-semibold text-inksoft">
              Pexels
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
