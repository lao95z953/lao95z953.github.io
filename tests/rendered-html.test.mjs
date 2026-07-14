import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const outputRoot = new URL("../out/", import.meta.url);

test("exports the finished Traditional Chinese homepage", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  assert.match(html, /LAO_Z_3/);
  assert.match(html, /lang="zh-Hant"/);
  assert.match(html, /Break\./);
  assert.match(html, />Writeups</);
  assert.match(html, /Tools &amp; Labs/);
  assert.match(html, />Reflections</);
  assert.match(html, />Guestbook/);
  assert.match(html, /收錄 CTF WP 以及未來的 Pentest 靶機 WP/);
  assert.match(html, /Achievements \/ 成績紀錄/);
  assert.match(html, /Google Cybersecurity/);
  assert.match(html, />MFCTF<\/h3>/);
  assert.match(html, />V1TCTF<\/h3>/);
  assert.match(html, />R3CTF<\/h3>/);
  assert.match(html, />InfoSecCTF<\/h3>/);
  assert.match(html, /帽子工廠/);
  assert.match(html, />JuniorCryptCTF<\/h3>/);
  assert.match(html, /第 53 名 · Team RCEs-2/);
  assert.match(html, />BroncoCTF<\/h3>/);
  assert.match(html, /第 49 名 · Team RCEs/);
  assert.match(html, /UPDATED \/ 2026\.07\.14/);
  assert.ok(
    html.indexOf("BroncoCTF") < html.indexOf("JuniorCryptCTF"),
  );
  assert.ok(
    html.indexOf("JuniorCryptCTF") < html.indexOf("InfoSecCTF"),
  );
  assert.match(html, /仍在學習中的 CTF 玩家/);
  assert.match(html, /Web Security/);
  assert.match(html, /AI Security/);
  assert.match(html, /Reverse Engineering/);
  assert.match(html, /Pwn/);
  assert.match(html, /持續學習中/);
  assert.match(html, /lao95z953@gmail\.com/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("exports discoverability files", async () => {
  const [robots, sitemap] = await Promise.all([
    readFile(new URL("robots.txt", outputRoot), "utf8"),
    readFile(new URL("sitemap.xml", outputRoot), "utf8"),
  ]);

  assert.match(robots, /User-Agent:\s*\*/i);
  assert.match(robots, /Sitemap:\s*https:\/\/lao95z953\.github\.io\/sitemap\.xml/i);
  assert.match(sitemap, /https:\/\/lao95z953\.github\.io/);
  assert.match(sitemap, /https:\/\/lao95z953\.github\.io\/guestbook/);
});
