# LAO_Z_3 資安學習筆記

**LAO_Z_3** 的個人 CTF、資安研究與開發學習網站。

## 本機開發

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`。

## 驗證

```bash
npm test
npm run lint
```

正式版本會輸出為 `out/` 靜態網站，並以 Direct Upload 部署至 Cloudflare Pages。

## 公開留言板

Guestbook 透過 Cloudflare Pages Functions 提供同網域 API，留言與便條位置儲存在 D1。若新增資料庫 migration，發布前先執行：

```bash
npm run db:migrate:remote
```

## 發布

完成一次 `npx wrangler login` 後，執行下列指令即可建置並重新發布正式網站：

```bash
npm run deploy
```

公開網址：

`https://lao95z953.pages.dev/`
