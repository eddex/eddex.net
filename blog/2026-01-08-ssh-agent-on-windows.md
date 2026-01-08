---
layout: blog-post.njk
eleventyNavigation:
  key: "2026-01-08: ssh-agent with git on Windows"
  parent: Blog
  excerpt: How I use git with a password protected SSH key on Windows
title: Configuring ssh-agent for git on Windows
permalink: "blog/{{ title | slugify }}/index.html"
tags:
  - git
  - ssh
---

For security reasons, it's recommended to have a password for your SSH keys.
However, typing the password on every single `git` command you run is tedious and annoying.

That's why there is `ssh-agent`, a small tool that caches your password so you only have to type it once.

This blog post serves as personal documentation for the process of creating a password protected SSH
key and configuring `ssh-agent` for `git` on Windows. It contains some opinionated choices.

## 0. Prerequisites

The instructions on this page assume you use a Windows PC with `git` installed.

## 1. Generate an SSH key

Open PowerShell and run:

```sh
ssh-keygen -t ed25519 -C "your@email.com"
```

When asked for the file name, just press enter to accept the default: `C:\Users\<USERNAME>\.ssh\id_ed25519`.
Make sure to set a password!

Add the public key (`id_ed25519.pub`) to your git host (GitHub, GitLab etc.).

## 2. Set `ssh-agent` to Manual startup type

Start PowerShell as Administrator and run:

```sh
Get-Service -Name ssh-agent | Select-Object Name, StartType
```

This will display the startup type of the `ssh-agent`. It should be `Manual`.
If it isn't, change it by running:

```sh
Get-Service -Name ssh-agent | Set-Service -StartupType Manual
```

There are other tutorials that will tell you to configure the service as `Automatic`.
But I prefer to start it manually whenever I need it.

Now you can close the Administrator PowerShell.

## 3. Start `ssh-agent`

Every time you want to use the `ssh-agent`, you have to start it.
Open PowerShell and run:

```sh
ssh-agent
```

You can check if the service is running with:

```sh
Get-Service -Name ssh-agent
```

## 4. Add your SSH key to `ssh-agent`

To cache your password you need to add your key to the `ssh-agent`.

```sh
ssh-add
```

### 4.1. Security considerations

Unlike on Linux or Mac, where your passwords are cached until you log out,
the `ssh-agent` on Windows caches your password **forever** even if you restart your machine.
Obviously that's not great in case someone gains access to your PC or you install some funny
`npm` packages that try to steal your SSH keys.

That's why you should always remove the password from `ssh-agent` whenever you're
done with your work.

Use this command to remove all cached keys from `ssh-agent`:

```sh
ssh-add -D
```

## 5. Configure `git` to use OpenSSH shipped with Windows

If you run a git command like `git pull` in a repo now, you will notice that you're
still asked for your SSH key password.
The SSH client included in `git` for Windows doesn't seem to work with `ssh-agent`.

Configure `git` to use the OpenSSH client included in Windows to fix this:

```sh
git config --global core.sshCommand C:/Windows/System32/OpenSSH/ssh.exe
```

## That's it!

My workflow with this configuration looks like this:

- When I want to use `git`, I run `ssh-agent` followed by `ssh-add`
- Once I'm done, I run `ssh-add -D` to remove the password from the cache.

## Further documentation

- [GitHub Docs | Generate new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [GitHub Docs | SSH key passphrases](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/working-with-ssh-key-passphrases)
