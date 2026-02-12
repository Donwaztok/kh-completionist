# Kingdom Hearts Steam Achievement Tracker

Rastreie suas conquistas da franquia Kingdom Hearts na Steam. Insira seu SteamID ou vanity URL e veja o progresso organizado por coleção (1.5+2.5, 2.8, KH3).

## Tecnologias

- Next.js 16 (App Router)
- TypeScript
- HeroUI (biblioteca de componentes)
- Tailwind CSS
- Steam Web API

## Funcionalidades

- 🔍 Busca por SteamID64 ou vanity URL
- 📦 Coleções: 1.5+2.5, 2.8, KH3
- 📊 Jogos Kingdom Hearts com conquistas
- 🏆 Badges: 100% | Em progresso | Não iniciado
- 📈 Barras de progresso por jogo e por coleção
- 🔎 Filtros: Todos | Apenas 100% | Apenas incompletos | Apenas não iniciados
- ↕ Ordenação: Maior/menor percentual, Ordem cronológica, A-Z
- 💾 Último SteamID salvo no localStorage
- 🌓 Modo Dark/Light
- 📱 Layout responsivo

## Configuração

### 1. Obter chave da Steam API

Acesse [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) e crie uma chave de API.

### 2. Variáveis de ambiente

Copie o arquivo de exemplo e configure:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione sua chave:

```
STEAM_API_KEY=sua_chave_aqui
```

### 3. Instalação

```bash
npm install
```

### 4. Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 5. Build

```bash
npm run build
```

### 6. Deploy na Vercel

1. Faça push do projeto para o GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Configure a variável de ambiente `STEAM_API_KEY` no painel da Vercel
4. Deploy automático

## Estrutura do projeto

```
app/
  api/kingdom-hearts/route.ts   # API route handler (jogos KH)
  page.tsx                       # Página principal
  layout.tsx
components/
  SteamSearchForm.tsx            # Formulário de busca
  CollectionCard.tsx             # Card de coleção
  KHGameCard.tsx                 # Card de jogo KH
  KHFiltersBar.tsx               # Filtros e ordenação
  AchievementList.tsx            # Lista de conquistas
lib/
  kingdom-hearts.ts              # AppIDs fixos + fetch KH
  steam.ts                       # Resolve SteamID
types/
  steam.ts                       # Tipos TypeScript
```

## API

A rota `/api/kingdom-hearts?steamid=SEU_STEAMID` retorna:

```json
{
  "collections": [
    {
      "name": "1.5 + 2.5",
      "games": [
        {
          "name": "Kingdom Hearts HD 1.5 + 2.5 ReMIX",
          "appId": 2552430,
          "totalAchievements": 56,
          "unlockedAchievements": 32,
          "percentage": 57,
          "isCompleted": false,
          "achievements": [...]
        }
      ]
    }
  ]
}
```

## Jogos suportados

- **1.5 + 2.5**: Kingdom Hearts Final Mix, Re:Chain of Memories, Kingdom Hearts II Final Mix, 358/2 Days (cutscenes), Birth by Sleep Final Mix, Re:Coded (cutscenes)
- **2.8**: Dream Drop Distance HD, 0.2 Birth by Sleep – A Fragmentary Passage, χ Back Cover (filme)
- **KH3**: Kingdom Hearts III, Re Mind (DLC)

## Mapeamento de conquistas

As conquistas são mapeadas para jogos individuais dentro de cada coleção. Para atualizar o mapeamento (após mudanças na Steam):

```bash
npm run build-achievement-mapping
```

Isso busca o schema da API Steam e regenera `config/achievement-mapping.ts`.

## Observações

- O perfil Steam deve estar público para que as conquistas sejam acessíveis
- São buscados apenas jogos Kingdom Hearts (AppIDs hardcoded)
- Respostas cacheadas por 5 minutos
- Máximo 4 requisições paralelas
