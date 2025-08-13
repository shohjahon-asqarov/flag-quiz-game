## Flag Quiz Game — Texnik topshiriq (TZ)

### 1. Qisqa tavsif
Flag Quiz Game — foydalanuvchiga turli davlatlar bayroqlarini ko‘rsatib, to‘g‘ri davlat nomini topishni taklif qiladigan o‘yin. O‘yin 10 ta savoldan iborat bo‘lib, har bir savolda 4 ta variant taqdim etiladi. To‘g‘ri javob tanlanganda ball oshadi, yakunda natija ko‘rsatiladi.

### 2. Maqsad
- Qiziqarli ta’limiy o‘yin orqali bayroqlarni tanish ko‘nikmasini oshirish.
- Minimal yuklanish va silliq UI tajribasini ta’minlash.
- Kengaytiriladigan, testlanadigan va qo‘llab-quvvatlanadigan kod bazani yaratish.

### 3. Rol va foydalanuvchi ssenariylari
- Rol: O‘yinchi
  - O‘yinchini ishga tushiradi, savolga javob beradi, keyingi savolga o‘tadi, yakunda natijani ko‘radi va xohlasa qayta o‘ynaydi.

### 4. Funksional talablar
- O‘yin:
  - 10 ta savol ketma-ketligi.
  - Har savolda 1 ta to‘g‘ri va 3 ta noto‘g‘ri variant (jami 4 ta).
  - Variantlar adolatli tasodifiylashtirilgan bo‘lishi kerak (Fisher–Yates shuffle).
  - Javob tanlangandan so‘ng:
    - To‘g‘ri variant yashil, noto‘g‘ri tanlov qizil rangda ko‘rsatiladi.
    - Variantlar bekor qilinadi (qayta bosib bo‘lmaydi).
  - “New Question” tugmasi faqat javob tanlangandan keyin faollashadi.
  - Yakunda umumiy ball va savollar soni ko‘rsatiladi.
  - “Reset” o‘yinni qayta boshlaydi va yangi savollarni yuklaydi.
- Holatlar:
  - Yuklanish holati: spinner ko‘rinadi.
  - Xato holati: xabar va “Retry” tugmasi ko‘rinadi.

### 5. Qo‘shimcha funksiyalar (keyingi bosqichlar)
- Taymer va vaqt cheklovi rejimlari.
- Qiyinlik darajalari (Easy/Normal/Hard).
- Mahalliy saqlash (localStorage) orqali so‘nggi natijalarni ko‘rish.
- Yetakchilar jadvali (leaderboard) — ixtiyoriy backend bilan.
- Ijtimoiy tarmoqlarda bo‘lishish.
- Tungi rejim (Dark mode).
- Offline rejim (service worker) — bayroq tasvirlarini oldindan kesh qilish.

### 6. Nofunksional talablar
- Ishonchlilik: Fetch bekor qilish (`AbortController`), xatolarni ushlash va xabar berish.
- Ishlash samaradorligi: Minimal yuklanish; UI javobgarligi yuqori bo‘lishi; spinner tez ko‘rinishi.
- Moslashuvchan dizayn: Mobil, planshet va desktoplarda to‘liq moslashuv.
- Kirish imkoniyati (Accessibility): Klaviatura bilan boshqarish, `aria-` atributlari, aniq kontrast ranglar.
- Xavfsizlik: Maxfiy kalitlar yo‘q; faqat ochiq API.
- Kod sifati: ESLint toza holatda; aniq nomlash va komponentlar bo‘linishi.

### 7. Texnologiyalar va muhit
- Frontend: React 19, Vite 7, Tailwind CSS 4, Bootstrap Icons.
- API: `https://restcountries.com/v3.1/independent?status=true` (ochiq ma’lumotlar).
- Node.js: LTS tavsiya etiladi.

### 8. Arxitektura (frontend)
- Asosiy komponent: `App` — o‘yin oqimi, savollar holati va UI.
- Holat (state): `currentQuestion`, `answered`, `selectAnswer`, `score`, `showScore`, `questions`, `loading`, `error`.
- Ma’lumot oqimi: `fetch` orqali API’dan davlatlar, filtrlash, savol/variantlarni yaratish, shuffle va UIga berish.
- Abort: Komponent unmount paytida `AbortController` bilan so‘rov bekor qilinadi.

### 9. Ma’lumot modeli
```ts
type AnswerOption = {
  answerText: string;
  isCorrect: boolean;
};

type Question = {
  questionText: string;    // "What flag is this?"
  countryName: string;     // Masalan: "Uzbekistan"
  flag: string;            // PNG yoki SVG URL
  answerOptions: AnswerOption[]; // 4 ta variant
};
```

### 10. Foydalanuvchi oqimi
1) Ilova ochiladi → yuklanish spinneri → savol ko‘rinadi.
2) Foydalanuvchi variant tanlaydi → to‘g‘ri/noto‘g‘ri feedback ranglarda.
3) “New Question” → keyingi savol.
4) 10-savoldan so‘ng → yakuniy natija → “Reset” bilan qayta o‘ynash.
5) Xato bo‘lsa → xabar + “Retry”.

### 11. UI/dizayn talablar
- Soddalik: fokus bayroq va variantlarda.
- Tushunarli ranglar: to‘g‘risi — yashil, noto‘g‘risi — qizil.
- Tugmalar yirik va mobilga qulay.
- Tipografiya va ranglar Tailwind orqali boshqariladi.

### 12. Holatlarni ko‘rsatish
- Loading: markazda spinner.
- Error: izoh va qayta urinib ko‘rish tugmasi.
- Empty state: “No questions available.” xabari (noyob holat).

### 13. Test va sifat
- Unit: util funksiyalar (shuffle), savollarni yaratish jarayonida kontraktlar.
- Component tests: javob tanlash, rang feedback, “Next” tugmasi holati.
- Lint: ESLint 0 xato.

### 14. Joylashtirish (Deployment)
- Statik build: `npm run build` → `dist/`.
- Har qanday statik hosting (Vercel/Netlify/GitHub Pages) orqali xizmat ko‘rsatish.

### 15. Qabul qilish mezonlari (DoD)
- 10 ta savol oqimi to‘liq ishlaydi.
- Variantlar adolatli aralashtirilgan.
- Bir martalik javob: qayta bosish bloklanadi.
- Holatlar (loading/error) to‘g‘ri ko‘rsatiladi.
- Yakuniy natija va reset ishlaydi.
- ESLint xatosiz build va `npm run build` muvaffaqiyatli.

### 16. Repozitoriy tuzilmasi
```
flag-quiz-game/
  src/
    App.jsx
    main.jsx
    index.css
    assets/
  public/
  docs/
    TZ_UZ.md
  README.md
  index.html
  vite.config.js
```

### 17. Yo‘l xaritasi (Roadmap)
- [ ] Klaviatura navigatsiyasi (↑/↓, Enter)
- [ ] Dark mode
- [ ] Natijalarni mahalliy saqlash
- [ ] Timer va qiyinlik darajalari
- [ ] Leaderboard (backend bilan)
- [ ] Offline (PWA)

### 18. Litsenziya
- Litsenziya: loyiha talablariga muvofiq tanlanadi (masalan, MIT).


