# خروجة · Khrouga

> مش عارفين تخرجوا فين؟ حدد المنطقة والميزانية والمزاج، وخروجة تقترح عليك أماكن بأسعارها وصورها وريلاتها وخريطتها وحجز واتساب.

موبايل‑فيست، RTL، باللهجة المصرية، لايت/دارك، PWA يتثبت على الموبايل، ويتنشر ببلاش على Vercel أو Netlify.

---

## قبل الإطلاق للجمهور — اعمل دول بالترتيب

1. **أكّد بيانات ١٠–٢٠ مكان بنفسك:** الاسم، العنوان الدقيق، المنطقة، متوسط تكلفة الفرد، أسعار ٣–٥ أصناف، ساعات العمل، رقم واتساب للحجز، رابط خرائط، وصورة بإذن صاحبها. صور الديمو وريلات Pexels **مش تصوير حقيقي للأماكن**؛ استبدلها قبل ما تقول للناس إنها صور المكان.
2. **اسأل صاحب كل مكان:** هل واتساب ده يستقبل حجوزات فعلًا؟ هل عنده ريل/صور تسمح باستخدامها؟ لو مفيش حجز على واتساب سيب الرقم فاضي لحد ما تتفقوا. جرّب الحجز لنفسك أولًا.
3. **جهّز Supabase:** شغّل SQL، اعمل bucket `places` عام، وخد اتصال Postgres من Session Pooler. إعدادات الاتصال وStorage تتضاف على Vercel كـ secrets — **متحطش مفتاح service role في المتصفح أو GitHub**.
4. **انشر على Vercel:** اربط GitHub، أضف متغيرات البيئة، Deploy، ثم `/api/health`. سجّل دخول `/admin`، ضيف الأماكن الموثقة فقط، وجرّب من موبايل حقيقي. افتح الموقع من Chrome/Safari واختار «Add to Home Screen» لتجربة الـ PWA.
5. **تابع التشغيل:** راجع الأسعار أسبوعيًا، صحّح أي بلاغ فورًا، وتابع استهلاك Supabase/Vercel عشان تفضل في المجاني. عشان الثقة، تاريخ «آخر تحديث» في الكارت لازم يعكس مراجعة فعلية للأسعار.

> لو معاك `index.html` و`places.js` الأصلية، هما **مش موجودين في نسخة المشروع دي**؛ الـ seed الحالي بيانات توضيحية بديلة. انقل بياناتك الحقيقية عبر `/admin` أو عدّل `src/lib/seed-data.ts` للاختبار المحلي فقط.

---

## ١. الستاك

| الطبقة | التقنية |
| --- | --- |
| الواجهة | Next.js (App Router) + React 19 + Tailwind CSS v4 |
| الداتا | Postgres (Supabase) + Drizzle ORM |
| الصور | Supabase Storage (اختياري) أو تخزين مضغوط في الداتابيز |
| الخطوط | Readex Pro (العناوين) + Cairo (النص) |
| PWA | `manifest.webmanifest` + `sw.js` (أوفلاين للصفحة و`/api/places`) |

الفلترة بتحصل في المتصفح على الداتا القادمة من السيرفر (فورية + تشتغل أوفلاين)، وفي نفس الوقت `/api/places` بيعمل الفلترة في SQL لأي استهلاك خارجي.

---

## ٢. التشغيل محليًا

```bash
npm install
cp .env.example .env          # ظبط DATABASE_URL و ADMIN_PASSWORD
npx drizzle-kit push          # يعمل جدول places
npx tsx src/db/seed.ts        # يزرع ١٥ مكان تجريبي بصور وريلات حقيقية
npm run dev                   # http://localhost:3000
```

> **مهم:** الزرع التلقائي بيشتغل في التطوير فقط. الإنتاج يبدأ فاضي إلا لو حطيت `ENABLE_DEMO_SEED=true` صراحةً. الـ ١٥ مكان أمثلة توضيحية **مش موثقة**؛ الأسماء والأرقام والأسعار والخرائط قد تكون وهمية أو غير دقيقة، وصور/ريلات Pexels لا تمثل المكان الحقيقي. متعرضهاش لجمهور حقيقي.

**لوحة الأدمن:** `/admin` — ظبط `ADMIN_PASSWORD` و`ADMIN_SESSION_SECRET` قبل النشر. لو ما ضبطتهمش هتترفض محاولة الدخول في الإنتاج. القيمة الافتراضية `khrouga2026` للتطوير المحلي فقط.

---

## ٣. Supabase

### ٣.١ الجدول

افتح Supabase Dashboard → **SQL Editor** والصق محتوى [`supabase/schema.sql`](supabase/schema.sql) ثم Run.
الملف بيعمل: جدول `places`، الفهارس، فهرس GIN على `moods`، تفعيل RLS مع قراءة عامة، وتريجّر `updated_at`.

### ٣.٢ الصور (اختياري)

1. Storage → **New bucket** → الاسم `places` → **Public**.
2. حط القيم في البيئة:

```bash
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role key>   # سيرفر فقط — متحطهاش NEXT_PUBLIC
SUPABASE_STORAGE_BUCKET=places
```

لو سبتهم فاضيين، الرفع هيشتغل برضه: الصورة بتتصغّر في المتصفح (١٤٠٠px، جودة ٧٨٪) وبتتخزن كـ `data:` URL في نفس العمود.

### ٣.٣ ربط التطبيق

استخدم **Session pooler** connection string في `DATABASE_URL`:

```
postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

---

## ٤. متغيرات البيئة

| المتغير | مطلوب؟ | الوصف |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | رابط Postgres (محلي أو Supabase) |
| `ADMIN_PASSWORD` | ✅ في الإنتاج | كلمة سر لوحة الأدمن |
| `ADMIN_SESSION_SECRET` | ✅ في الإنتاج | سر عشوائي طويل لتوقيع كوكي الجلسة |
| `NEXT_PUBLIC_SITE_URL` | مُستحسن | للـ metadata / Open Graph |
| `SUPABASE_URL` | اختياري | لتفعيل رفع الصور على Storage |
| `SUPABASE_SERVICE_ROLE_KEY` | اختياري | مفتاح الخدمة (سيرفر فقط) |
| `SUPABASE_STORAGE_BUCKET` | اختياري | اسم البكت (افتراضي `places`) |
| `NEXT_PUBLIC_CONTACT_WHATSAPP` | اختياري | رقم واتساب خروجة لاستقبال اقتراحات الأماكن؛ الزر يختفي لو فاضي |
| `ENABLE_DEMO_SEED` | لا | `true` للديمو المنشور فقط؛ **سيبه `false` للموقع الحقيقي** |

---

## ٥. النشر (ببلاش)

### Vercel (الأسهل)
1. اعمل مشروع Supabase مجاني، وشغّل `supabase/schema.sql` من SQL Editor **قبل** أول زيارة للموقع.
2. اعمل Storage bucket عام اسمه `places`، وانسخ رابط قاعدة البيانات من **Session Pooler**.
3. ارفع المشروع على GitHub → **Import** في Vercel.
4. Environment Variables: `DATABASE_URL`، `ADMIN_PASSWORD` قوي وفريد، `ADMIN_SESSION_SECRET` عشوائي طويل، `NEXT_PUBLIC_SITE_URL`، ومتغيرات Supabase Storage (موصى بها).
5. Deploy → افتح `/api/health` وتأكد إنه رجع `{ "ok": true }`، ثم افتح `/admin` وضيف **أماكن حقيقية** مع إذن أصحابها. **ما تشغّلش seed الإنتاج.**
6. جرّب رابط صفحة مكان، الفلاتر، الخريطة، رسالة واتساب، والموبايل. بعد التعديل على متغيرات `NEXT_PUBLIC_*` اعمل Redeploy.

### Netlify
- نفس الخطوات: Build command `npm run build`، Publish directory `.next`، وضيف Environment variables.
- الـ PWA والـ service worker شغالين عادي لأن كل الملفات في `public/`.

> **ملاحظة Vercel + Supabase:** استخدم الـ Session pooler (بورت 5432) مش الـ Transaction pooler (6543) لأن Drizzle مع `node-postgres` محتاج جلسات حقيقية.

---

## ٦. الملفات المهمة

```
src/
├── app/
│   ├── layout.tsx              # RTL + الخطوط + manifest + سكريبت الثيم
│   ├── page.tsx                # الرئيسية: هيرو + فلاتر + شبكة النتائج
│   ├── p/[slug]/page.tsx       # صفحة المكان (رابط قابل للمشاركة + JSON-LD)
│   ├── admin/page.tsx          # محمية بكلمة سر
│   ├── not-found.tsx           # ٤٠٤ بالعربي
│   └── api/
│       ├── places/route.ts             # GET + فلترة SQL
│       ├── places/[slug]/route.ts      # GET مكان + أماكن مشابهة
│       └── admin/{login,logout,places,places/[id],upload,seed}/route.ts
├── components/                 # الهيرو، كارت المكان، الفلاتر، الريلات، الأدمن…
├── hooks/                      # useFavorites · useTheme
├── lib/                        # schema queries · filter · format · auth · storage · validate
└── db/{schema.ts,seed.ts,index.ts}
public/{manifest.webmanifest,sw.js,icon-*.png}
supabase/schema.sql
scripts/generate-icons.mjs
```

---

## ٧. الـ API

| الطلب | الوصف |
| --- | --- |
| `GET /api/places?area=&type=&mood=رومانسي,شلة&maxPrice=&q=` | أماكن مفلترة في SQL |
| `GET /api/places/:slug` | مكان واحد + `similar` |
| `POST /api/admin/login` · `POST /api/admin/logout` | جلسة الأدمن (كوكي موقّع HMAC) |
| `GET/POST/PUT /api/admin/places` | قائمة / إضافة / تعديل (`id` في جسم الطلب) |
| `DELETE /api/admin/places/:id` | حذف |
| `POST /api/admin/upload` | رفع صورة `{ dataUrl, name }` |
| `POST /api/admin/seed?mode=append\|replace` | زرع الأمثلة |
| `GET /api/health` | فحص الصحة |

كل مسارات `/api/admin/*` بتتحقق من الكوكي وترجع `401` لو مش مسجّل.

---

## ٨. الميزات المتنفذة

- ✅ فلاتر: منطقة، سلايدر ميزانية (مع هيستوجرام توزيع الأسعار)، أجواء، أنواع، بحث، وترتيب (٥ اختيارات).
- ✅ «اختارلي أنا 🎲»: روليت بيلف على النتائج المطابقة ويقف على مكان، مع «لفّ تاني».
- ✅ كارت المكان: صورة، السعر، التقييم، التاجات، أشهر أصناف المنيو بسعرها، **آخر تحديث**، واتساب/خريطة/ريل، وحفظ في المفضلة.
- ✅ صفحة مكان: جاليري، **اختيار أصناف من المنيو وحساب الإجمالي مباشرة**، رسالة واتساب جاهزة بالعدد والموعد والطلب، خريطة، ريل، مشاركة (`navigator.share` + نسخ اللينك)، وأماكن مشابهة.
- ✅ المفضلة في `localStorage` (من غير تسجيل دخول) + تبويب مخصص + عدّاد في الهيدر.
- ✅ لوحة أدمن: إحصاءات، بحث، إضافة/تعديل/حذف، محرر منيو ديناميكي، رفع صور (Supabase Storage أو الداتابيز)، وزرع الأمثلة.
- ✅ PWA: manifest عربي RTL + service worker (أوفلاين للصفحة والـ API) + أيقونات maskable.
- ✅ لايت/دارك من غير وميض، مع احترام `prefers-color-scheme` و`prefers-reduced-motion`.

## ٩. خطة v2 (لسه)

- تسجيل دخول بالموبايل (Supabase Auth) ومزامنة المفضلة بين الأجهزة.
- تقييمات المستخدمين + «بلغ عن سعر غلط».
- إشعارات Push لعروض الأماكن، وصفحة «خروجة النهاردة» مقترحة يوميًا.
