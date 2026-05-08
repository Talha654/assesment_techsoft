# React Native – Short Answer Questions

---

## 1. FlatList vs SectionList vs FlashList?

**FlatList** is my go-to for most lists — simple, works fine. Used it on a product catalog with ~80 items, no issues.

**SectionList** I used in a CRM app where leads were grouped by status. The built-in sticky headers saved me from hacking grouping logic manually.

**FlashList** I reach for when the list is long or cells are heavy. We had a feed with 500+ items and FlatList was visibly dropping frames on mid-range Android. Switched to FlashList, set `estimatedItemSize`, problem gone. Now it's my default for anything I know will grow.

---

## 2. Animated API vs Reanimated 3?

Reanimated 3 is my default now. Runs on the UI thread so it stays smooth even when JS is busy — huge deal for anything gesture-driven.

I only fall back to the Animated API for simple stuff like fading in a toast or a skeleton loader. `useNativeDriver: true` handles that fine and I don't want to add Reanimated boilerplate for a 300ms fade.

---

## 3. Hermes Off — When?

Almost never. The one real case: we had a third-party native module that used JSC-specific internals and kept throwing weird errors on Hermes that didn't show up on JSC. Stack traces were completely different between engines, made it really hard to debug. Temporarily switched the app to JSC while waiting for the library to fix their side. That's about the only time I'd touch that default.

---

## 4. iOS Archive Fails on CI, Works Locally — First Three Checks?

1. **CocoaPods version** — CI probably isn't running `bundle exec pod install`. I check if `Gemfile.lock` is committed and if CI is using Bundler at all.

2. **Signing / provisioning profile** — the cert might not be in CI's keychain, or the profile expired. I've been burned by a profile expiring mid-sprint and only failing at the archive step.

3. **Missing env vars** — we use `react-native-config` and `.env.production` is gitignored. If CI doesn't have those injected, the build compiles but archive fails silently.

---

## 5. App Crashes "Sometimes" on Launch — How I Narrow It Down?

Start with Crashlytics filtered to fatal events under 2 seconds. If the stack traces are consistent, it's reproducible. If they're scattered, I start thinking race condition or device-specific issue.

Then I check Sentry's breadcrumbs — Crashlytics only shows the crash, Sentry shows what led up to it. Non-fatal errors right before the crash usually tell the real story.

If it's still unclear, I get the user's device, hook it up via Xcode or `adb logcat`, and try to reproduce. One time it was a Keychain read silently failing on an older iOS version — wrapped it in try/catch with a fallback and it was gone.

---

## 6. Real Bug That Took More Than a Day

**Symptom:** I was building a mail scanner app that used the OpenAI API (GPT-4o) to parse and extract data from emails. Tested it myself with small mails — worked perfectly. Built the APK, sent it to the client, they tested with small emails too, everyone was happy. Then a day later the client comes back saying scanning just stops working. I check on my side, works fine. Turns out they were scanning large, complex emails with a lot of content.

**What I thought it was:** First thing I did was swap the model — thought maybe GPT-4o was behaving differently on certain inputs or there was an API change. Updated the code, still failing. That burned almost a full day.

**What it actually was:** The `max_tokens` I had set in the API call was too low. For short emails it was fine, but once the email content got large, the response was getting cut off mid-way and the parsing broke. The API wasn't throwing an error — it just returned a truncated response and my code didn't handle that case.

**The fix:** Increased `max_tokens` to a value that could handle large emails comfortably, and also added a check on the response to detect if it was incomplete before trying to parse it.

**What would've caught it earlier:** Testing with real-world data from the start, not just small sample emails. Also should've added response validation — if the response doesn't match the expected structure, flag it instead of silently failing. That one change would've made the bug obvious on day one.

---

## 7. Inherited Mess — No Tests, Class Components, Redux + Thunks. Manager Wants Zustand + Hooks. This Week?

I wouldn't touch Redux this week. Big-bang rewrites on shipped apps always go sideways.

This week I'd: write tests for the most critical thunk logic first (gives me a safety net), then pick one small, low-risk thing and put it in a Zustand store so the team can see the pattern, and convert one class component to a function component with hooks and document it. That's it.

Incremental and parallel. Redux keeps running in prod, Zustand grows alongside it. The worst outcome is breaking production trying to modernize it in one sprint.
