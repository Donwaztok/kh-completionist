# KH Completionist

Track your Kingdom Hearts franchise achievements on Steam. Enter your SteamID or vanity URL and see progress organized by collection (1.5+2.5, 2.8, KH3).

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- HeroUI (component library)
- Tailwind CSS
- Steam Web API

## Features

- 🔍 Search by SteamID64 or vanity URL
- 📦 Collections: 1.5+2.5, 2.8, KH3
- 📊 Kingdom Hearts games with achievements
- 🏆 Badges: 100% | In progress | Not started
- 📈 Progress bars per game and per collection
- 🔎 Per-game achievement filters: All | Unlocked only | Locked only
- ↕ Per-game sorting: Unlocked first | Locked first
- 💾 Last SteamID saved in localStorage
- 🌓 Dark theme
- 📱 Responsive layout

## Setup

### 1. Get Steam API key

Visit [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) and create an API key.

### 2. Environment variables

Copy the example file and configure:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your key:

```
STEAM_API_KEY=your_key_here
```

### 3. Installation

```bash
npm install
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build

```bash
npm run build
```

### 6. Deploy to Vercel

1. Push the project to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Set the `STEAM_API_KEY` environment variable in the Vercel dashboard
4. Automatic deploy

## Project structure

```
app/
  api/kingdom-hearts/route.ts   # API route (KH achievements)
  api/steam/route.ts            # API route (generic Steam)
  page.tsx                      # Main page
  layout.tsx
  providers.tsx
components/
  SteamSearchForm.tsx           # Search form
  Dashboard.tsx                 # Stats sidebar
  KHGameCard.tsx                # Game card with achievement filters
  AchievementList.tsx           # Achievement list
  navbar.tsx
config/
  achievement-mapping.ts       # Achievement → game mapping
  fonts.ts
  site.ts
lib/
  kingdom-hearts.ts             # AppIDs + KH fetch logic
  steam.ts                      # SteamID resolver
types/
  steam.ts
```

## API

The route `/api/kingdom-hearts?steamid=YOUR_STEAMID` returns:

```json
{
  "collections": [
    {
      "name": "1.5 + 2.5",
      "games": [
        {
          "name": "Kingdom Hearts Final Mix",
          "appId": 2552430,
          "totalAchievements": 56,
          "unlockedAchievements": 32,
          "percentage": 57,
          "isCompleted": false,
          "achievements": [...]
        }
      ]
    }
  ],
  "player": { "personaname": "...", "avatarfull": "...", "profileurl": "..." }
}
```

## Supported games

- **1.5 + 2.5**: Kingdom Hearts Final Mix, Re:Chain of Memories, Kingdom Hearts II Final Mix, 358/2 Days (cutscenes), Birth by Sleep Final Mix, Re:Coded (cutscenes)
- **2.8**: Dream Drop Distance HD, 0.2 Birth by Sleep – A Fragmentary Passage, χ Back Cover (movie)
- **KH3**: Kingdom Hearts III, Re Mind (DLC)

## Achievement mapping

Achievements are mapped to individual games within each collection in `config/achievement-mapping.ts`. The mapping is maintained manually. When Steam adds or changes achievements, update the mapping file accordingly.

## Notes

- Steam profile must be public for achievements to be accessible
- Only Kingdom Hearts games are fetched (AppIDs hardcoded)
- Responses cached for 5 minutes
- Max 4 parallel requests
