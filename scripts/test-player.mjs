import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";

// Execute the real entrypoint. Only browser/network/audio boundaries are faked;
// no live requests, installed packages, or audio files are needed by these tests.
const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const catalog = JSON.parse(readFileSync(new URL("../catalog.json", import.meta.url), "utf8"));
const fixture = { ...catalog, sounds: catalog.sounds.slice(0, 2) };
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const flush = () => new Promise(resolve => setImmediate(resolve));

class Node {
  constructor(tagName = "div") {
    this.tagName = tagName.toUpperCase();
    this.children = []; this.dataset = {}; this.style = {};
    this.attributes = {}; this.listeners = {}; this.className = "";
    this.hidden = false; this.value = ""; this.textContent = "";
    this.classList = { toggle: (name, on) => {
      const classes = new Set(this.className.split(" ").filter(Boolean));
      if (on) classes.add(name); else classes.delete(name);
      this.className = [...classes].join(" ");
    } };
  }
  append(...nodes) {
    for (const node of nodes) {
      if (node.tagName === "FRAGMENT") this.append(...node.children);
      else { node.parent = this; this.children.push(node); }
    }
  }
  replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
  setAttribute(key, value) { this.attributes[key] = value; }
  getAttribute(key) { return this.attributes[key] ?? null; }
  addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
  dispatch(type, values = {}) {
    return Promise.all((this.listeners[type] || []).map(listener =>
      listener({ target: this, preventDefault() {}, ...values })));
  }
  closest(selector) {
    return this.className.split(" ").includes(selector.slice(1))
      ? this : this.parent?.closest(selector);
  }
}

function boot(responses, query = "") {
  const document = new Node("document");
  document.activeElement = new Node("body");
  const nodes = new Map();
  for (const match of html.matchAll(/<([a-z]+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {
    const node = new Node(match[1]);
    for (const attribute of match[2].matchAll(/([\w-]+)="([^"]*)"/g))
      node.setAttribute(attribute[1], attribute[2]);
    node.hidden = /\bhidden\b/.test(match[2]);
    node.focus = () => { document.activeElement = node; };
    nodes.set(match[3], node);
  }
  nodes.get("count").textContent = "Loading catalog…";
  nodes.get("sort").value = "name";
  document.querySelector = selector => nodes.get(selector.slice(1)) || null;
  document.querySelectorAll = selector => {
    const walk = node => [node, ...node.children.flatMap(walk)];
    return [...nodes.values()].flatMap(walk)
      .filter(node => node.className.split(" ").includes(selector.slice(1)));
  };
  document.createElement = tag => new Node(tag);
  document.createDocumentFragment = () => new Node("fragment");
  const audio = new Node("audio");
  audio.paused = true; audio.src = "";
  audio.pause = () => { audio.paused = true; };
  audio.removeAttribute = name => { if (name === "src") audio.src = ""; };
  audio.play = async () => { audio.paused = false; };
  const calls = [];
  const location = { pathname: "/Free-Sound-Effects/", search: query, hash: "#library" };
  const history = { replaceState: (_state, _title, url) => {
    const parsed = new URL(url, "https://example.test");
    location.search = parsed.search;
    location.hash = parsed.hash;
  } };
  const ready = runInNewContext(`(async () => {\n${source}\n})()`, {
    document, Audio: function () { return audio; }, URLSearchParams, location, history,
    fetch: async url => {
      assert.equal(url, "catalog.json", "The player must only request its relative catalog");
      calls.push(url);
      const response = responses.shift();
      assert(response, "Unexpected duplicate catalog request");
      return typeof response === "function" ? response() : response;
    },
  });
  return { ready, document, audio, calls, location, get: id => nodes.get(id),
    buttons: () => document.querySelectorAll(".play") };
}
const ok = (data = fixture) => ({ ok: true, json: async () => structuredClone(data) });
const unavailable = { ok: false, status: 503 };

test("catalog failure survives filter changes, reset and Escape without claiming no results", async () => {
  const app = boot([unavailable]);
  await app.ready;
  for (const [id, event] of [["search", "input"], ["category", "change"], ["sort", "change"], ["reset", "click"]]) {
    await app.get(id).dispatch(event);
    assert.equal(app.get("count").textContent, "Catalog unavailable");
    assert.equal(app.get("empty").hidden, true);
  }
  await app.document.dispatch("keydown", { key: "Escape" });
  assert.match(app.get("catalog-notice").textContent, /could not load/i);
  assert.equal(app.get("catalog-notice").hidden, false);
  assert.equal(app.get("catalog-notice").getAttribute("role"), "status");
  assert.equal(app.get("retry").hidden, false);
  assert.equal(app.get("notice").textContent, "");
});

test("pending catalog stays loading rather than showing an empty catalog", async () => {
  const pending = deferred();
  const app = boot([() => pending.promise]);
  app.get("search").value = "Back 002";
  await app.get("search").dispatch("input");
  await app.document.dispatch("keydown", { key: "Escape" });
  assert.equal(app.get("count").textContent, "Loading catalog…");
  assert.equal(app.get("empty").hidden, true);
  pending.resolve(ok());
  await app.ready;
  assert.match(app.get("count").textContent, /^1 of 2 sounds/);
});

test("retry recovers without duplicate requests or losing filters and moves focused retry to search", async () => {
  const pending = deferred();
  const app = boot([unavailable, () => pending.promise], "?q=Back&category=Back&sort=long");
  await app.ready;
  app.get("search").value = "Back 002";
  await app.get("search").dispatch("input");
  assert.ok(app.get("retry"), "Catalog failure needs an operable retry control");
  app.get("retry").focus();
  await app.get("retry").dispatch("click");
  await app.get("retry").dispatch("click");
  assert.equal(app.calls.length, 2);
  assert.equal(app.get("count").textContent, "Loading catalog…");
  assert.equal(app.get("retry").getAttribute("aria-disabled"), "true");
  pending.resolve(ok());
  await flush();
  assert.match(app.get("count").textContent, /^1 of 2 sounds/);
  assert.equal(app.get("catalog-notice").hidden, true);
  assert.equal(app.get("retry").hidden, true);
  assert.equal(app.get("category").value, "Back");
  assert.equal(app.get("sort").value, "long");
  assert.equal(app.document.activeElement, app.get("search"));
  assert.equal(app.location.search, "?q=Back+002&category=Back&sort=long");
  assert.equal(app.location.hash, "#library");
});

test("failed retry stays actionable and reset during failure is retained on recovery", async () => {
  const app = boot([unavailable, unavailable, ok()], "?q=missing&category=Back&sort=short");
  await app.ready;
  assert.ok(app.get("retry"), "Catalog failure needs an operable retry control");
  await app.get("retry").dispatch("click"); await flush();
  assert.equal(app.get("count").textContent, "Catalog unavailable");
  assert.equal(app.get("retry").getAttribute("aria-disabled"), "false");
  await app.get("reset").dispatch("click");
  await app.get("retry").dispatch("click"); await flush();
  assert.match(app.get("count").textContent, /^2 of 2 sounds/);
  assert.equal(app.get("category").value, "");
  assert.equal(app.get("sort").value, "name");
  assert.equal(app.location.search, "");
});

test("network, JSON and malformed-catalog failures remain distinct from a successful empty result", async () => {
  for (const response of [() => Promise.reject(Error("offline")), { ok: true, json: async () => { throw Error("invalid JSON"); } }, ok({ sounds: null })]) {
    const app = boot([response]); await app.ready;
    await app.get("sort").dispatch("change");
    assert.equal(app.get("count").textContent, "Catalog unavailable");
    assert.equal(app.get("empty").hidden, true);
  }
  const app = boot([ok({ ...fixture, sounds: [] })]); await app.ready;
  assert.match(app.get("count").textContent, /^0 of 0 sounds/);
  assert.equal(app.get("empty").hidden, false);
  assert.equal(app.get("catalog-notice").hidden, true);
});

test("retry does not steal focus if the user moved to another control while loading", async () => {
  const pending = deferred();
  const app = boot([unavailable, () => pending.promise]);
  await app.ready;
  app.get("retry").focus();
  await app.get("retry").dispatch("click");
  app.get("sort").focus();
  pending.resolve(ok()); await flush();
  assert.equal(app.document.activeElement, app.get("sort"));
});

test("ready catalog retains search, no results, sorting, reset and keyboard controls", async () => {
  const app = boot([ok()], "?q=Back&category=Back&sort=long"); await app.ready;
  assert.equal(app.buttons()[0].dataset.title, "Back 002");
  app.get("search").value = "missing"; await app.get("search").dispatch("input");
  assert.match(app.get("count").textContent, /^0 of 2 sounds/);
  assert.equal(app.get("empty").hidden, false);
  await app.get("reset").dispatch("click");
  assert.match(app.get("count").textContent, /^2 of 2 sounds/);
  assert.equal(app.document.activeElement, app.get("search"));
  assert.equal(app.buttons()[0].dataset.title, "Back 001");
  app.document.activeElement = new Node("body");
  await app.document.dispatch("keydown", { key: "/" });
  assert.equal(app.document.activeElement, app.get("search"));
});

test("preview errors, completion and Escape still use playback status only", async () => {
  const app = boot([ok()]); await app.ready;
  await app.buttons()[0].dispatch("click");
  assert.match(app.get("notice").textContent, /Playing Back 001/);
  assert.equal(app.buttons()[0].getAttribute("aria-pressed"), "true");
  await app.audio.dispatch("ended");
  assert.equal(app.get("notice").textContent, "Preview finished.");
  app.audio.play = async () => { throw Error("unsupported"); };
  await app.buttons()[0].dispatch("click");
  assert.match(app.get("notice").textContent, /Could not play Back 001/);
  assert.match(app.get("count").textContent, /^2 of 2 sounds/);
  await app.document.dispatch("keydown", { key: "Escape" });
  assert.equal(app.get("notice").textContent, "");
  assert.equal(app.audio.src, "");
});

test("switching and filtering fence stale asynchronous playback completions", async () => {
  const app = boot([ok()]); await app.ready;
  const pending = deferred();
  app.audio.play = () => pending.promise;
  const first = app.buttons()[0].dispatch("click");
  app.audio.play = async () => { app.audio.paused = false; };
  await app.buttons()[1].dispatch("click");
  pending.resolve(); await first;
  assert.equal(app.get("notice").textContent, "Playing Back 002");
  assert.equal(app.buttons()[0].getAttribute("aria-pressed"), "false");
  assert.equal(app.buttons()[1].getAttribute("aria-pressed"), "true");
  const stale = deferred();
  app.audio.play = () => stale.promise;
  const play = app.buttons()[0].dispatch("click");
  await app.get("search").dispatch("input");
  stale.reject(Error("late failure")); await play;
  assert.equal(app.get("notice").textContent, "");
  assert.equal(app.audio.src, "");
});
