import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const outputRoot = new URL("../out/", import.meta.url);

test("exports the finished Traditional Chinese homepage", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");

  assert.match(html, /LAO_Z_3/);
  assert.match(html, /lang="zh-Hant"/);
  assert.match(html, /Understand\./);
  assert.match(html, /Exploit\./);
  assert.match(html, /Explain\./);
  assert.match(html, />Posts</);
  assert.match(html, /Tools &amp; Labs/);
  assert.match(html, />Reflections</);
  assert.match(html, />Tags</);
  assert.match(html, /04 COLLECTIONS/);
  assert.match(html, />Guestbook/);
  assert.match(html, /Community wall \/ 訪客留言板/);
  assert.match(html, /寫一張便條/);
  assert.match(html, /id="guestbook"/);
  assert.match(html, /LAO_Z_3 \/ GUESTBOOK/);
  assert.doesNotMatch(html, /LAO_Z_3 \/ FIELD NOTES/);
  assert.match(html, /CTF WP、未來的 Pentest 靶機 WP 與概念筆記/);
  assert.match(html, /用 tag 橫向找文章/);
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
  assert.match(html, /UPDATED \/ 2026\.11\.09/);
  assert.match(html, />HITCON CTF<\/h3>/);
  assert.match(html, />AEGIS CTF<\/h3>/);
  assert.match(html, /Final 第 14 名/);
  assert.match(html, /第 21 名 · Team RCEs/);
  // 新的排在最上面
  assert.ok(html.indexOf("AEGIS CTF") < html.indexOf("HITCON CTF"));
  assert.ok(html.indexOf("HITCON CTF") < html.indexOf("BroncoCTF"));
  assert.ok(
    html.indexOf("BroncoCTF") < html.indexOf("JuniorCryptCTF"),
  );
  assert.ok(
    html.indexOf("JuniorCryptCTF") < html.indexOf("InfoSecCTF"),
  );
  assert.match(html, /我是一名在 CTF 和 PT 的學生/);
  assert.match(html, /如果有任何寫錯的地方請直接指出/);
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
  assert.match(robots, /Sitemap:\s*https:\/\/lao95z953\.pages\.dev\/sitemap\.xml/i);
  assert.match(sitemap, /https:\/\/lao95z953\.pages\.dev/);
  assert.match(sitemap, /https:\/\/lao95z953\.pages\.dev\/guestbook/);
  assert.match(sitemap, /https:\/\/lao95z953\.pages\.dev\/posts/);
  assert.match(sitemap, /https:\/\/lao95z953\.pages\.dev\/tags/);
  assert.match(
    sitemap,
    /https:\/\/lao95z953\.pages\.dev\/posts\/cylab-hashgate\//,
  );
  assert.match(
    sitemap,
    /https:\/\/lao95z953\.pages\.dev\/tags\/pwnable-tw\//,
  );
  assert.doesNotMatch(sitemap, /\/writeups\//);
});

test("merges every post into one tag-indexed collection", async () => {
  const [index, tagsIndex, tagPage, post, redirects] = await Promise.all([
    readFile(new URL("posts/index.html", outputRoot), "utf8"),
    readFile(new URL("tags/index.html", outputRoot), "utf8"),
    readFile(new URL("tags/pwnable-tw/index.html", outputRoot), "utf8"),
    readFile(new URL("posts/cylab-hashgate/index.html", outputRoot), "utf8"),
    readFile(new URL("_redirects", outputRoot), "utf8"),
  ]);

  // 四篇文章全部落在同一個列表裡
  for (const slug of ["cylab-hashgate", "pwnable-tw-orw", "pwnable-tw-start"]) {
    assert.match(index, new RegExp(`/posts/${slug}/`));
  }

  // 列表不再按分類分區，也不保留舊的兩個入口
  assert.doesNotMatch(index, /href="\/writeups\//);
  assert.doesNotMatch(index, /href="\/notes\//);

  // tag 是唯一的分類方式，且每個 tag 都點得進去
  assert.match(tagsIndex, /\/tags\/writeup\//);
  assert.match(tagsIndex, /\/tags\/pwnable-tw\//);

  // 含點號的 tag 會被 slug 化，兩篇 pwnable.tw 都要在同一頁
  assert.match(tagPage, /pwnable\.tw orw/);
  assert.match(tagPage, /pwnable\.tw start/);

  // 文章頁的 tag 是連結，不是純文字標籤
  assert.match(post, /href="\/tags\/idor\/"/);
  assert.doesNotMatch(post, /prose-meta-cat/);

  // 舊網址要轉向到新的單一列表
  // 兩種 trailing slash 寫法都要在，Cloudflare 的文件沒有保證單一寫法會同時命中
  assert.match(redirects, /^\/notes\/:slug \/posts\/:slug\/ 301$/m);
  assert.match(redirects, /^\/notes\/:slug\/ \/posts\/:slug\/ 301$/m);
  assert.match(redirects, /^\/writeups\/:slug \/posts\/:slug\/ 301$/m);
  assert.match(redirects, /^\/writeups\/:slug\/ \/posts\/:slug\/ 301$/m);
});
