---
title: "HackTheBox Cascade Writeup"
date: "2025-04-03"
tags: 
- writeups
- HTB
- AD
---

This is a medium box, but it felt hard to me. It was relatively fun to pwn.

## nmap

Starting off with an `nmap` scan, all the ports open are typical ports for a domain controller.

![ad1](images/cascade1.png)

## Initial Recon

Anonymous `ldap` bind is successful.

![ad1](images/cascade2.png)

Under user `r.thompson`, there is a field that looks like a `base64` encoded password string. Decoding it gives a cleartext password.

![ad1](images/cascade3.png)

![ad1](images/cascade4.png)

However, running `netexec` shows that user `r.thompson` is not a member of the `Remote Management Users` group.

![ad1](images/cascade5.png)


## Lateral Movement

### First Lateral Movement

Running `netexec` to enumerate `smb` shows that the user `r.thompson` can read the non-default share `Data`.

![ad1](images/cascade6.png)

Using `smbclinet` to log on, there are 3 files that catch my attention.

![ad1](images/cascade7.png)

![ad1](images/cascade8.png)

![ad1](images/cascade20.png)

The content of `VNC Install.reg` reveals a password field. 
![ad1](images/cascade9.png)

Looking up for "VNC password decrypt", I found this Github repo that says how to decrypt the password on Linux: https://github.com/frizb/PasswordDecrypts

I obtained the cleartext password for user `s.smith` and determined that the user is a member of the `Remote Management Users` group.

![ad1](images/cascade10.png)
![ad1](images/cascade11.png)

### Second Lateral Movement

Running `netexec` reveals that the user `s.smith` can read the non-default drive `Audit$`.

![ad1](images/cascade12.png)

In the drive, I downloaded 2 files. One is a `.NET` executable and the other one is a `sqlite` database file.

![ad1](images/cascade13.png)
![ad1](images/cascade14.png)

After opening the database file with `sqlite3 Audit.db`, I executed the following commands to extract a `base64` encoded password string for user `arksvc`. However, decoding it reveals unreadable characters, which is an indication that the string is encrypted.

![ad1](images/cascade15.png)

Next, I used `AvaloniaILSpy` to decompile `CascAudit.exe` and found that the executable is used to decrypt passwords. Since it uses a function `Crypto.DecryptString`, I went back and downloaded `CascCrypto.dll` from `smb`.

![ad1](images/cascade16.png)

Decompiling it reveals that it's performing `AES` encryption. 

![ad1](images/cascade17.png)

Obtaining the mode, IV, and secret key, an online decryptor gives the cleartext password for the user `arksvc`.
![ad1](images/cascade18.png)


## Privilege Escalation

In the file I obtained earlier via `smb` about meeting notes, it reveals that we will need to find the password of `TempAdmin` since it will be the same as the Administrator's password.

![ad1](images/cascade19.png)

In the log file I obtained earlier via `smb`, it shows that the user `TempAdmin` has been deleted by `arksvc`.
![ad1](images/cascade21.png)

I logged in as `arksvc` via `evil-winrm`.

![ad1](images/cascade22.png)

Enumerating deleted users using the `powershell` command reveals a `base64` encoded password string that can be directly decoded. 

![ad1](images/cascade23.png)

![ad1](images/cascade25.png)

`netexec` shows that the Administrator's password is indeed the same as `TempAdmin`.
![ad1](images/cascade24.png)

