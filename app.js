const $ = (s) => document.querySelector(s);
const search = $("#search"),
  category = $("#category"),
  sort = $("#sort");
const player = new Audio();
player.preload = "none";
player.volume = 0.5;
let sounds = [],
  catalogState = "loading",
  active = null,
  playToken = 0;
const params = new URLSearchParams(location.search);
search.value = params.get("q") || "";
sort.value = ["short", "long"].includes(params.get("sort"))
  ? params.get("sort")
  : "name";
let requestedCategory = params.get("category") || "";
const notice = (text) => {
  $("#notice").textContent = text;
};
function stop() {
  playToken++;
  player.pause();
  player.removeAttribute("src");
  active = null;
  syncButtons();
  notice("");
}
function syncButtons() {
  document.querySelectorAll(".play").forEach((b) => {
    const playing = b.dataset.id === active && !player.paused;
    b.textContent = playing ? "Ⅱ" : "▶";
    b.setAttribute("aria-pressed", String(playing));
    b.setAttribute(
      "aria-label",
      `${playing ? "Pause" : "Preview"} ${b.dataset.title}`,
    );
    b.closest(".card").classList.toggle("playing", playing);
  });
}
function element(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}
function link(text, href) {
  const a = element("a", "", text);
  a.href = href;
  return a;
}
function render() {
  stop();
  if (catalogState !== "ready") return;
  const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const filtered = sounds.filter(
    (s) =>
      (!category.value || s.category === category.value) &&
      terms.every((t) =>
        `${s.title} ${s.id} ${s.tags.join(" ")} ${s.creator} ${s.license}`
          .toLowerCase()
          .includes(t),
      ),
  );
  filtered.sort((a, b) =>
    sort.value === "short"
      ? a.durationSeconds - b.durationSeconds
      : sort.value === "long"
        ? b.durationSeconds - a.durationSeconds
        : a.title.localeCompare(b.title),
  );
  $("#count").textContent =
    `${filtered.length} of ${sounds.length} sounds · verified CC0 sources`;
  $("#empty").hidden = filtered.length !== 0;
  const fragment = document.createDocumentFragment();
  filtered.forEach((s) => {
    const card = element("article", "card");
    card.id = s.id;
    const top = element("div", "card-top");
    const b = element("button", "play", "▶");
    b.type = "button";
    b.dataset.id = s.id;
    b.dataset.title = s.title;
    b.setAttribute("aria-label", `Preview ${s.title}`);
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", async () => {
      if (active === s.id && !player.paused) {
        stop();
        return;
      }
      stop();
      const token = ++playToken;
      active = s.id;
      player.src = s.path;
      notice(`Loading ${s.title}…`);
      try {
        await player.play();
        if (token !== playToken) return;
        notice(`Playing ${s.title}`);
        syncButtons();
      } catch (e) {
        if (token !== playToken) return;
        stop();
        notice(
          `Could not play ${s.title}. Try downloading the OGG file or use a browser with Ogg Vorbis support.`,
        );
      }
    });
    const waveform = element("div", "card-wave");
    waveform.setAttribute("aria-hidden", "true");
    waveform.title = "Decorative audio motif";
    for (let i = 0; i < 24; i++) {
      const bar = element("i");
      bar.style.height = `${8 + (parseInt(s.sha256.slice(i, i + 2), 16) % 24)}px`;
      waveform.append(bar);
    }
    top.append(
      b,
      waveform,
      element("span", "format", `${s.durationSeconds.toFixed(2)}s · OGG`),
    );
    const bottom = element("div", "card-bottom");
    const links = element("div", "links");
    const download = link("Download ↓", s.path);
    download.download = s.path.split("/").pop();
    download.setAttribute("aria-label", `Download ${s.title}`);
    const source = link("Source ↗", s.sourceUrl);
    source.setAttribute("aria-label", `Original source for ${s.title}`);
    links.append(source, download);
    bottom.append(element("span", "license", "CC0 1.0"), links);
    card.append(
      top,
      element("h3", "", s.title),
      element("p", "meta", `${s.category} / ${s.creator}`),
      bottom,
    );
    fragment.append(card);
  });
  $("#sounds").replaceChildren(fragment);
  const params = new URLSearchParams();
  if (search.value) params.set("q", search.value);
  if (category.value) params.set("category", category.value);
  if (sort.value !== "name") params.set("sort", sort.value);
  history.replaceState(
    null,
    "",
    `${location.pathname}${params.size ? "?" + params : ""}${location.hash}`,
  );
}
player.addEventListener("ended", () => {
  active = null;
  syncButtons();
  notice("Preview finished.");
});
player.addEventListener("error", () => {
  if (active) {
    const title = sounds.find((s) => s.id === active)?.title;
    stop();
    notice(`Could not load ${title}. Try downloading the file.`);
  }
});
$("#volume").addEventListener("input", (e) => {
  player.volume = Number(e.target.value);
});
$("#filters").addEventListener("submit", (e) => e.preventDefault());
search.addEventListener("input", render);
category.addEventListener("change", () => {
  requestedCategory = category.value;
  render();
});
sort.addEventListener("change", render);
$("#reset").addEventListener("click", () => {
  search.value = "";
  category.value = "";
  requestedCategory = "";
  sort.value = "name";
  render();
  search.focus();
});
document.addEventListener("keydown", (e) => {
  if (
    e.key === "/" &&
    !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)
  ) {
    e.preventDefault();
    search.focus();
  }
  if (e.key === "Escape") stop();
});
const retry = $("#retry");
retry.addEventListener("click", () => {
  if (catalogState === "error") void loadCatalog();
});
async function loadCatalog() {
  catalogState = "loading";
  $("#count").textContent = "Loading catalog…";
  $("#catalog-notice").hidden = true;
  $("#empty").hidden = true;
  // Keep a retry's keyboard focus while preventing concurrent requests.
  retry.setAttribute("aria-disabled", "true");
  try {
    const response = await fetch("catalog.json");
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.sounds)) throw Error("Invalid sound catalog");
    sounds = data.sounds;
    const all = element("option", "", "All categories");
    all.value = "";
    category.replaceChildren(all);
    [...new Set(sounds.map((s) => s.category))].sort().forEach((c) => {
      const o = element("option", "", c);
      o.value = c;
      category.append(o);
    });
    category.value = requestedCategory;
    catalogState = "ready";
    render();
    if (document.activeElement === retry) search.focus();
    retry.hidden = true;
  } catch (e) {
    catalogState = "error";
    $("#count").textContent = "Catalog unavailable";
    $("#empty").hidden = true;
    $("#catalog-notice").textContent =
      "The sound catalog could not load. Try again below, or browse the audio files on GitHub.";
    $("#catalog-notice").hidden = false;
    retry.hidden = false;
  } finally {
    retry.setAttribute("aria-disabled", "false");
  }
}
await loadCatalog();
