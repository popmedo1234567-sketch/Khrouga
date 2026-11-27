import Link from "next/link";
import { Logo, Pin } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-spice to-saffron text-spiceink">
        <Logo width={34} height={34} />
      </span>
      <p className="mt-5 font-display text-[clamp(3rem,14vw,5rem)] font-bold leading-none text-spice">٤٠٤</p>
      <h1 className="mt-2 font-display text-2xl font-bold">المكان ده مش موجود عندنا</h1>
      <p className="mt-2 text-sm leading-7 text-muted">
        يمكن اللينك اتغير أو المكان اتشال من القايمة. رجوعك للصفحة الرئيسية هيوريك كل الأماكن المتاحة.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-13 items-center gap-2 rounded-2xl bg-ink px-6 py-4 font-display text-base font-bold text-bg transition-transform hover:scale-[1.03] active:scale-95"
      >
        <Pin width={19} height={19} /> ارجع استكشف
      </Link>
    </div>
  );
}
