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

正式版本會輸出為 `out/` 靜態網站，可部署至 GitHub Pages。

## 發布

推送至 `main` 後，GitHub Actions 會自動建置並將 `out/` 發布至：

`https://lao95z953.github.io/`

也可以在 repository 的 Actions 頁面手動執行 `Deploy Next.js site to Pages`。
