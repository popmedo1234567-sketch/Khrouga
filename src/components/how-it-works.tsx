import type { Place } from "@/lib/constants";
import { toArabicDigits } from "@/lib/constants";
import BudgetCalculator from "./budget-calculator";
import { Coin, Dice, Menu, WhatsApp } from "./icons";

const STEPS = [
  {
    n: "١",
    icon: Coin,
    title: "حدد المنطقة والميزانية والمزاج",
    body: "سلايدر الميزانية بيوّريك عدد الأماكن في كل شريحة سعر، والشرائح اللي فوق ميزانيتك بتبهت لوحدها.",
    tint: "var(--saffron)",
  },
  {
    n: "٢",
    icon: Menu,
    title: "قارن المنيو والأسعار",
    body: "كل كارت فيه أشهر الأصناف بسعرها، وآخر تحديث للسعر، وتقييم، وتاجات زي «فيو نيل» أو «ركن أطفال».",
    tint: "var(--spice)",
  },
  {
    n: "٣",
    icon: WhatsApp,
    title: "احجز على واتساب أو خد الخريطة",
    body: "الرسالة بتتكتب لوحدها بالعدد والموعد والأصناف اللي اخترتها، وتتبعت للمكان في ضغطة واحدة.",
    tint: "var(--mint)",
  },
];

/** إزاي التطبيق بيشتغل + حاسبة الميزانية */
export default function HowItWorks({ places }: { places: Place[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-plum">ببساطة كده</p>
          <h2 className="mt-1 font-display text-[clamp(1.6rem,4.5vw,2.4rem)] font-bold">
            من «هنخرج فين؟» لـ «اتحجز» في ٣ خطوات
          </h2>

          <ol className="mt-8 space-y-6">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                className="reveal relative flex gap-4 rounded-[26px] border border-line bg-surface p-5 transition-transform duration-300 hover:-translate-y-1"
                style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
              >
                <span className="relative shrink-0">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-2xl font-display text-2xl font-bold"
                    style={{ background: `color-mix(in srgb, ${s.tint} 18%, transparent)`, color: s.tint }}
                  >
                    <s.icon width={26} height={26} />
                  </span>
                  <span
                    className="absolute -top-2 -left-2 grid h-7 w-7 place-items-center rounded-full font-display text-sm font-bold text-bg"
                    style={{ background: s.tint }}
                  >
                    {s.n}
                  </span>
                </span>
                <span>
                  <span className="block font-display text-lg font-bold">{s.title}</span>
                  <span className="mt-1 block text-sm leading-7 text-muted">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>

          <p className="reveal mt-6 flex items-start gap-2 rounded-2xl border border-dashed border-line bg-surface2/60 p-4 text-sm leading-7 text-inksoft">
            <Dice width={20} height={20} className="mt-0.5 shrink-0 text-spice" />
            مش قادر تختار؟ زرار <b className="text-ink">«اختارلي أنا»</b> بيلف على الأماكن المطابقة لفلاترك ويوقف على واحد —
            وفيه زرار «لفّ تاني» لو مش مقتنع. عندنا {toArabicDigits(places.length)} مكان جاهزين للفّة.
          </p>
        </div>

        <div className="reveal lg:sticky lg:top-24 lg:self-start">
          <BudgetCalculator places={places} />
        </div>
      </div>
    </section>
  );
}
