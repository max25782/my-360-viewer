# הגדרת שליחת מיילים מ-Onboarding

## מה עשינו?
כשמשתמש ממלא את שאלון ה-onboarding, התוצאות נשלחות אוטומטית למייל `office@adu-seattle.com`.

## הגדרה (3 שלבים):

### 1. קבל API Key מ-Resend
1. היכנס ל-[Resend.com](https://resend.com)
2. צור חשבון או התחבר
3. לך ל-API Keys
4. צור מפתח חדש

### 2. הוסף את המפתח לקובץ `.env.local`
פתח את הקובץ `.env.local` והוסף:

```env
RESEND_API_KEY=re_המפתח_שלך_כאן
```

### 3. אמת את הדומיין (אופציונלי אבל מומלץ)
- בלוח הבקרה של Resend, לך ל-Domains
- הוסף את `adu-seattle.com`
- עקוב אחרי הוראות ה-DNS
- חכה לאימות (כמה דקות)

## מה נשלח במייל?

המייל כולל:
- ✅ מידע על המשתמש (שם וכתובת)
- ✅ סוג הפרויקט (ADU / DADU / Premier)
- ✅ מטרה (השכרה, משפחה, משרד וכו')
- ✅ תקציב וזמנים
- ✅ העדפות (גודל, חדרי שינה, חניה, סגנון)
- ✅ סדרי עדיפויות
- ✅ אפשרויות מימון
- ✅ המלצות בתים (עם ציונים)
- ✅ תובנות אישיות
- ✅ תאריך ושעה

## בדיקה
```bash
npm run dev
```

1. גש ל-`http://localhost:3000/onboarding`
2. מלא את השאלון
3. בדוק את המייל ב-`office@adu-seattle.com`

## פתרון בעיות
- **לא הגיע מייל**: בדוק קונסול בדפדפן
- **שגיאה 500**: בדוק ש-RESEND_API_KEY מוגדר נכון
- **Authentication failed**: צור API key חדש

## קבצים ששונו
1. `src/app/api/send-onboarding/route.ts` - נקודת קצה חדשה לשליחת מיילים
2. `src/app/onboarding/page.tsx` - קורא ל-API אחרי סיום
3. `src/components/SmartOnboarding.tsx` - שומר תשובות ל-localStorage

---

**חשוב:** המפתח (API key) נשמר רק בשרת ולא נחשף למשתמש!

