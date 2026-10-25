# Social publishing research and agent rules

Reviewed 2026-10-25. This is practical editorial guidance, not a promise of reach. Recheck platform documentation and live composer capabilities before publishing. Do not turn public code snapshots into claims about every live experiment.

## Publishing contract

- Keep the primary post and artwork free of URLs, including bare domains and attribution URLs. Preserve concise creator/source credit. Put necessary product and source links in one useful own follow-up reply/thread/comment where supported; otherwise use the profile website. This is the owner's editorial preference, not a proven universal algorithm rule.
- If a license requires a particular attribution/link placement, satisfy it or select another asset. Moving a required credit is not automatically permitted. Public-domain assets still need accurate provenance; do not imply that the business photographed them.
- Prepare and inspect native previews, accessibility text, crops, account identity, date and destination. A composer or uploaded file is not a published post. A selected destination is not proof of acceptance, recommendation eligibility or delivery.
- Respect the current review/publishing hold. Never click Publish, Post all or Schedule merely to test validation. Do not enable ads, spending, paid subscriptions, credentials or broader account permissions as an optimization shortcut.
- Resolve each day's actual editorial selection at execution time. Do not schedule yesterday's image as tomorrow's daily wallpaper, or claim all personalized app installations show the same image. Evergreen posts can omit dates.
- Keep images dominant. Avoid stock-looking decorative posters, giant text, generic slogans and repeated templates. Use original, rights-cleared assets; distinguish a real photograph from AI-created artwork. Use a distinct motion treatment only when the platform requires or benefits from video.

## X: current published source review

Primary repository: [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm). Examined snapshot **6258a1549ef808be88fba83d3b2d58364b587ee0**, retrieved 2026-10-25. This is the newer Rust/Phoenix pipeline; do not silently substitute the older 2023 twitter/the-algorithm snapshot.

Scope: README and Phoenix architecture; Home Mixer ranking/value mapping, parameter defaults, age/reply filters; shared score fusion; URL-related botmaker rules and URL utility. This is a targeted source review, not an exhaustive audit of every subsystem or a live ranking experiment. No code was executed, models trained, accounts probed or private data accessed.

### What the code supports

1. **Scores combine predicted actions, not raw engagement totals.** [Fusion arithmetic](https://github.com/xai-org/x-algorithm/blob/6258a1549ef808be88fba83d3b2d58364b587ee0/xai-value-model/scoring.rs) multiplies predicted action probabilities/continuous values by weights. Its comments explicitly reject interpreting ratios as “one report cancels N likes.” Viewers receive personalized predictions.
2. **An external-link click is not universally a negative term in this scorer.** [Parameter defaults](https://github.com/xai-org/x-algorithm/blob/6258a1549ef808be88fba83d3b2d58364b587ee0/home-mixer/params/param.rs) set `OpenLinkWeight` to 0.2, while [value mapping](https://github.com/xai-org/x-algorithm/blob/6258a1549ef808be88fba83d3b2d58364b587ee0/home-mixer/scorers/value_model.rs) connects it to the predicted open-link head. This is neither a bonus for merely containing a URL nor proof that all link posts perform well.
3. **Other predicted behaviors also matter.** This snapshot includes favorite, reply, repost, photo expansion, share/DM, dwell and follow predictions, alongside not-interested, block, mute and report. A single coefficient cannot determine the outcome without prediction values, eligibility and subsequent ranking. Do not optimize around a copied coefficient table as if it were a points game.
4. **URL quality can cause real safety/distribution consequences.** [Bad URL rule](https://github.com/xai-org/x-algorithm/blob/6258a1549ef808be88fba83d3b2d58364b587ee0/botmaker-rules/scarecrow/bot/Tweet_Spam_High_Recall_RTF_All_Bad_URL_Sources.bot) uses redirection-chain verdicts and conditional exceptions before applying spam labels. [Low-quality URL plus non-follower mention rule](https://github.com/xai-org/x-algorithm/blob/6258a1549ef808be88fba83d3b2d58364b587ee0/botmaker-rules/scarecrow/bot/LQ_Tweets_With_LQ_URL_Verdict_At_Mention_To_NonFollower.bot) has specific conditions. These are not a blanket ban on every external URL. Never try to evade safety labels with redirectors or link disguises.
5. **Replies are not a reach loophole.** [Out-of-network reply filter](https://github.com/xai-org/x-algorithm/blob/6258a1549ef808be88fba83d3b2d58364b587ee0/home-mixer/filters/oon_retweet_reply_filter.rs) considers network status, missing ancestors and configuration-dependent Phoenix exceptions. [Self-reply chain filter](https://github.com/xai-org/x-algorithm/blob/6258a1549ef808be88fba83d3b2d58364b587ee0/home-mixer/filters/self_reply_chain_filter.rs) has separate relationship conditions. A URL reply is useful navigation, not guaranteed independent discovery.
6. **Freshness, deduplication, relationships and diversity matter.** The [architecture README](https://github.com/xai-org/x-algorithm/blob/6258a1549ef808be88fba83d3b2d58364b587ee0/README.md) describes sourcing, previously-seen filters, age eligibility, author diversity, network adjustments, cold-start handling and later VM ranking. [Age filter](https://github.com/xai-org/x-algorithm/blob/6258a1549ef808be88fba83d3b2d58364b587ee0/home-mixer/filters/age_filter.rs) uses a configured maximum age; do not conflate feed eligibility with deletion or every surface on X. Repeated near-identical posts and flooding threads are poor editorial defaults.
7. **Published defaults are not a complete live-system certificate.** The README describes configuration experiments and synchronization of primary production defaults. It also lists omitted Grox prompts, some botmaker rules and deployment components. [Phoenix documentation](https://github.com/xai-org/x-algorithm/blob/6258a1549ef808be88fba83d3b2d58364b587ee0/phoenix/README.md) distinguishes implementation from unavailable production feeds/infrastructure and local synthetic training. Do not claim to have reproduced today's model weights, traffic experiments or production reach.

### Practical X decisions

- Lead with a strong native image and one specific reason to care; make the main post understandable without opening the reply.
- Use one own follow-up for the official product and original source URLs. Keep stable, trustworthy destinations; no URL obfuscation, unrelated mentions, engagement rings or repetitive promotional reply spam.
- Ask a natural question only when the image supports one. Reply helpfully to real responses rather than adding artificial bait.
- Write descriptive ALT text for accessibility, not keyword stuffing. Keep hashtags relevant and sparse; no source-code claim establishes an ideal hashtag count.
- Measure impressions, media engagement, genuine replies, follows and attributable product visits separately. Evaluate multiple comparable posts before changing a practice; season, asset quality, audience size and timing confound comparisons. Do not violate the no-main-link preference to run an experiment without permission.
- Recheck the upstream commit before reusing numerical claims. Record review date, SHA, paths, evidence, inference and unknowns. Never assert “all links are suppressed” or “putting a link in a reply defeats suppression” from this review.

## Threads: topics and conversation

[Meta's topic update](https://about.fb.com/news/2025/03/new-threads-features-more-personalized-experience-you-control/) reports higher views for posts with tagged topics; that is platform guidance, not a guaranteed causal lift for an individual account. [Creator insights](https://about.fb.com/news/2024/10/find-your-community-with-new-threads-educational-insights/) favor useful image context and conversations.

For wallpapers, use the native **wallpapers** topic when available. Alternatives: Photography for a photographic discussion, Art for artwork, or a genuinely relevant Mac/setup topic if offered. Confirm a committed topic beside the account name; typing a search term alone is not selection. Do not use an unrelated trending topic.

Reusable series ideas:
- **Desktop of the day:** one striking image, its title and one concrete detail.
- **Seasonal switch:** autumn woods vs cool mountain lakes; ask a real preference question.
- **Art on your desktop:** identify the work, artist, museum and verified rights.
- **A calmer workspace:** show an actual desktop crop and explain why its composition leaves space for icons.
- **Make it yours:** show a real custom-background workflow or rotation feature, with accurate free/paid labels.

Use one concept per post. Avoid identical daily questions, inflated claims, excessive sales copy and redundant source/title lines. Put URLs in a follow-up or profile, preserving required credit.

## Snapchat: discovery versus an enduring collection

[Official API overview](https://developers.snap.com/marketing-api/Public-Profile-API/Introduction) distinguishes ephemeral Stories, saved profile Stories and Spotlight video distribution. [Saving a Story](https://help.snapchat.com/hc/en-us/articles/7012381865236-How-do-I-add-a-Story-to-my-Public-Profile) describes a curated profile collection. Saving is the evergreen route; a longer Story timer is not permanent storage.

- Spotlight is the discovery destination; [official posting constraints](https://developers.snap.com/marketing-api/Public-Profile-API/ProfileAssetManagement) describe MP4 video, not a static photograph. Published API duration limits and web uploader limits can differ. Verify the actual route and don't call a checkbox proof that a photo is eligible. No fabricated motion or AI replacement of the source scene is needed: a tasteful short pan can retain the real photograph.
- Prepare Spotlight with profile visibility enabled, and a saved Public Profile Story where appropriate. Profile saving and Spotlight live/recommended status must be verified separately after authorized publication/moderation.
- For a daily dated feature, 24 hours avoids a stack of stale “today” claims. For an evergreen image, the maximum available free duration is reasonable if desired, with date-free wording. The reviewed business web uploader offered 24 hours, 2, 3 and 7 days; 7 days did not show an upgrade requirement. Recheck per account. Do not purchase Snapchat+ for this.
- Some official web-help articles say Spotlight and Story require separate uploads; the reviewed uploader exposed both checkboxes. Treat this as documentation/UI drift. Verify actual posted destinations later rather than declaring cross-post success from selection.
- Use a photo-led vertical video with a safe crop and minimal caption; preserve the original master. No ornate poster, huge title or non-clickable URL artwork. Write useful topic/credit text and keep critical content away from screen edges and native overlays.
- Saved-profile selection disabled scheduling in the reviewed web composer. Do not silently drop profile saving to obtain scheduling. A paused routine or manual execution can prepare the final post when authorized.

## Facebook, Instagram and YouTube

- [Facebook's anti-spam guidance](https://about.fb.com/news/2025/04/cracking-down-spammy-content-facebook/) warns about irrelevant captions and excessive hashtags. Keep relevant photo context; no invented universal external-link penalty. A first comment can be added only when a real post exists if the draft composer does not support it.
- [Instagram's best-practices hub](https://about.fb.com/news/2024/10/best-practices-education-hub-creators-instagram/) provides personalized guidance. Keep profile-link navigation and visual quality; copyright permission alone does not make a repost original photography. Check native crop and ALT text.
- [YouTube image-post guidance](https://support.google.com/youtube/answer/7124474) recommends a square presentation in the feed. Preserve meaningful composition in the actual preview. Profile links and post/comment link clickability have different feature gates; verify the channel, don't start identity verification merely to add a link.
- Keep any necessary follow-up copy alongside the post plan when a native first-comment draft is unavailable. Never pretend an unpublished post already has a comment URL or delivery receipt.

## Cross-project use and evidence

Keep this guide canonical here rather than copying it into every app repo. Other agent guides may link to this document. Project-specific rights, release state, posting holds and approved destinations remain authoritative. Public documentation must not contain private account identifiers, credentials, mailbox contents, local file paths or unpublished business evidence.

Benefits: users see cleaner, relevant posts; maintainers have one dated evidence source; agents have explicit verification gates and fewer unsupported algorithm assumptions. Recheck after significant platform/source changes, not through an unsolicited scheduled crawler.
