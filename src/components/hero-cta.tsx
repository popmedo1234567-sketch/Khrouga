"use client";
import { Dice } from "./icons";

/** زرار الهيرو اللي بيفتح روليت "اختارلي أنا" جوه قسم الاستكشاف */
export default function HeroCta() {
  return (
    <button
      type="button"
      onClick={() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => window.dispatchEvent(new CustomEvent("khrouga:pick")), 450);
      }}
      className="group inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-spice/70 bg-spice/10 px-6 py-4 font-display text-base font-bold text-spice transition-all hover:bg-spice hover:text-spiceink active:scale-95"
    >
      <Dice width={21} height={21} className="transition-transform duration-500 group-hover:rotate-[220deg]" />
      اختارلي أنا 🎲
    </button>
  );
}
