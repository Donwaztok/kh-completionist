import { NextRequest, NextResponse } from "next/server";

import {
  fetchAllAchievements,
  resolveSteamId,
} from "@/lib/steam";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 minutos

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const steamIdInput = searchParams.get("steamid");

  if (!steamIdInput?.trim()) {
    return NextResponse.json(
      { error: "SteamID ou vanity URL é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const steamId = await resolveSteamId(steamIdInput);

    if (!steamId) {
      return NextResponse.json(
        { error: "SteamID ou vanity URL inválido. verifique e tente novamente." },
        { status: 404 }
      );
    }

    const games = await fetchAllAchievements(steamId);

    return NextResponse.json(
      { games },
      {
        headers: {
          "Cache-Control": "private, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";

    if (message.includes("STEAM_API_KEY")) {
      return NextResponse.json(
        { error: "API não configurada. Configure STEAM_API_KEY." },
        { status: 503 }
      );
    }

    if (
      message.includes("Forbidden") ||
      message.includes("private") ||
      message.includes("403")
    ) {
      return NextResponse.json(
        {
          error:
            "Perfil privado ou inacessível. Torne seu perfil público nas configurações do Steam.",
        },
        { status: 403 }
      );
    }

    console.error("[Steam API Error]", err);

    return NextResponse.json(
      { error: "Erro ao buscar conquistas. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
