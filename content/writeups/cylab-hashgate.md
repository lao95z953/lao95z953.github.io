---
title: "Cylab Hashgate — 可預測的 MD5(id) IDOR，闖進 admin profile"
date: "2026-07-22"
category: "Web"
tags: ["web", "picoctf", "cylab", "idor", "md5", "broken-access-control"]
summary: "登入頁 HTML 註解洩漏 guest 帳密；登入後 profile 用 MD5(user id) 當網址識別碼。把 guest 的 hash 丟 CrackStation 反查出 id=3000，再依『員工約 20 人』的提示從 3000 往上爆，在 3012 拿到 admin 的 flag。"
---

## 題目

You have gotten access to an organisation's portal. Submit your email and password, and it redirects you to your profile. But be careful: just because access to the admin isn’t directly exposed doesn’t mean it’s secure. Maybe someone forgot that obscurity isn’t security... Can you find your way into the admin’s profile for this organisation and capture the flag?

## 觀察過程

這題的界面長這樣
![alt text](/images/writeups/hashgate/image.png)

我的第一想法是要登入這個網站
然後我去看看 Source

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Login</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea, #764ba2);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    #loginForm {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(12px);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      padding: 40px;
      width: 100%;
      max-width: 350px;
      color: white;
    }

    #loginForm h2 {
      text-align: center;
      margin-bottom: 30px;
      font-weight: 600;
    }

    #loginForm label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
    }

    #loginForm input {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 8px;
      margin-bottom: 20px;
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      font-size: 14px;
    }

    #loginForm input::placeholder {
      color: #e5e5e5;
    }

    #loginForm button {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      background-color: #00c9a7;
      color: white;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    #loginForm button:hover {
      background-color: #00b494;
    }
  </style>
  <!-- Email: guest@picoctf.org Password: guest -->
</head>
<body>

  <form id="loginForm">
    <h2>Login</h2>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" placeholder="Enter your email" required />
    
    <label for="password">Password</label>
    <input type="password" id="password" name="password" placeholder="Enter your password" required />
    
    <button type="submit">Login</button>
  </form>

  <script>
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), // input 是 JSON
                redirect: 'follow' // 如果 3xx 他會直接 redirect -> 有可能 SSRF ?
            });

            if (response.redirected) {
                window.location.href = response.url; 
            } else {
                const data = await response.json();
                if (data.error) {
                    alert('Error: ' + data.error); // 假設這裡有 error 且後端有回傳 Error 的話就會走這條
                } else {
                    alert('Invalid credentials.'); // 假設 200 就會顯示這條
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong.');
        }
    });
  </script>
</body>
</html>

```

我在裡面有寫一些註解，我覺得重點是登入
然後這個 `JSON` 輸入給後端的行為讓我聯想到了 `NoSQL injection` 

## 現在開始嘗試

其實啊，我不會寫 Payload ，我要回去問 AI 了
但是我知道 NoSQLi 的本質是要在 `JSON` 的 Input 中加入正則式查詢
而後端的某些資料庫會進行正規化運算
<small>
註：
NoSQL 資料庫有多種類型，常見的有以下幾類：

文件型資料庫（Document Store）： 使用 JSON 或 BSON 格式儲存文件，典型代表為 MongoDB。文件資料庫的結構靈活，每個文件可以包含不同的欄位。
鍵值型資料庫（Key-Value Store）： 使用簡單的鍵值對來儲存資料。Redis 和 DynamoDB 是此類型的代表。這種資料庫可以非常高效地進行快速查詢。
圖形資料庫（Graph Database）： 主要用於處理需要儲存關聯資料的應用，例如社交網絡。典型代表為 Neo4j。它能夠有效地查找和分析節點與節點之間的關係。
資料行資料庫（Column Store）： 使用資料行來儲存資料，適合處理大規模讀取和寫入的應用。Apache Cassandra 和 HBase 是此類型的代表。
</small>
我問到 Payload 要怎麼寫了
我原本的 Request Body 是長這樣的：

```json
{"email":"a@b","password":"123"}
```

那我的 Payload 就應該是：

```json
{"email":"a@b","password":{"$ne":null}}
```

很遺憾的是他給我的回覆是

```json
{"success":false,"error":"Invalid input types."}
```

好哦，看來 DB 可能有擋我的 Input Type 不能是 Json
那我回頭再看看題目和 Sources

## 回去看 Source

題目說我已經獲取了一組賬密？
那在哪裡？

```html
<!-- Email: guest@picoctf.org Password: guest -->
```

在 Source 裡面...
登入之後的畫面長這樣
![alt text](/images/writeups/hashgate/image-1.png)
我觀察到他沒有 Cookie 然後內容寫的是

```text
Access level: Guest (ID: 3000). Insufficient privileges to view classified data. Only top-tier users can access the flag.
```

然後 URL 寫的是這個

```url
http://crystal-peak.picoctf.net:53868/profile/user/e93028bdc1aacdfb3687181f2031765d
```

他的 Url 中很明顯帶了一串 hash
去 CrackStation 中跑出來的是
![alt text](/images/writeups/hashgate/image-2.png)
那我知道了啊，就是我要去找到 Admin 的 ID 然後 MD5 加密過去就行了
但是 Guest 的 ID 是 3000 而提示是這個

```text
Hints
1
Notice anything about how the ID is being checked? It’s not plain text… maybe a one-way function is involved.

2
There are about 20 employees in this organisation.
```

我覺得第一個提示是在說我發現的那個 Hash
第二個是在說什麼呢？
我覺得可能是在暗示我可以跑字典
那我就從 3000 開始往上推
推到 3012 的時候就成功拿到 Flag 了

```flag
picoCTF{<打碼>}
```
