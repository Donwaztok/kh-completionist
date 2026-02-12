import { NextRequest, NextResponse } from "next/server";

import { fetchKingdomHeartsAchievements } from "@/lib/kingdom-hearts";
import { resolveSteamId } from "@/lib/steam";

export const dynamic = "force-dynamic";
export const revalidate = 300;

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
        {
          error:
            "SteamID ou vanity URL inválido. Verifique e tente novamente.",
        },
        { status: 404 }
      );
    }

    const result = await fetchKingdomHeartsAchievements(steamId);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "private, s-maxage=300, stale-while-revalidate=600",
      },
    });
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

    console.error("[Kingdom Hearts API Error]", err);

    return NextResponse.json(
      { error: "Erro ao buscar conquistas. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
