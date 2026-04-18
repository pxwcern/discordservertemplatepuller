# Discord Server Cloner Bot

## ⚠️ Disclaimer
**Using a user (self‑bot) token violates Discord's Terms of Service and can lead to a permanent ban of your account.** This repository is for **educational purposes only**. Use it at your own risk and **do not run it on production servers**.

## 📦 Overview
This bot clones the **structure** (roles, categories, text/voice channels) of a source Discord server to a target server.

- **Self‑bot (account token)** – Reads the source server.
- **Regular bot token** – Creates roles and channels on the target server.

## 🛠️ Prerequisites
- Node.js (v18 or later recommended)
- A Discord **user token** (self‑bot) – *not recommended for regular use*.
- A Discord **bot token** with the `MANAGE_ROLES`, `MANAGE_CHANNELS`, `MANAGE_GUILD` permissions on the target server.
- IDs of the source and target guilds (right‑click → `Copy ID` with Developer Mode enabled).

## 📂 Project Structure
```
starcord/
├─ .env          # environment variables (do NOT commit)
├─ index.js      # main cloning script
├─ package.json  # npm configuration
└─ README.md     # this file
```

## 🚀 Setup
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create a `.env` file** in the project root:
   ```dotenv
   ACCOUNT_TOKEN=YOUR_DISCORD_ACCOUNT_TOKEN   # self‑bot token
   BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN           # regular bot token
   SOURCE_GUILD_ID=SOURCE_SERVER_ID
   TARGET_GUILD_ID=TARGET_SERVER_ID
   ```
3. **Run the bot**
   ```bash
   npm start
   ```
   The script will log in both clients, fetch the source server, and recreate its roles and channels in the target server.

## 🛡️ Safety Tips
- Keep the `.env` file **private** – add it to `.gitignore` if you use version control.
- Test on **test servers** before using on real communities.
- Respect Discord rate limits – the script includes short delays, but large servers may still hit limits.

## 🛠️ Customisation
- Modify the `delay` value in `index.js` to adjust rate‑limit handling.
- Extend the script to copy emojis, stickers, or even messages (requires additional permissions and careful handling).

## 📜 License
This code is provided **as‑is** for learning purposes. No warranty is expressed or implied.
