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
      { error: "SteamID or vanity URL is required" },
      { status: 400 }
    );
  }

  try {
    const steamId = await resolveSteamId(steamIdInput);

    if (!steamId) {
      return NextResponse.json(
        {
          error:
            "Invalid SteamID or vanity URL. Check and try again.",
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
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("STEAM_API_KEY")) {
      return NextResponse.json(
        { error: "API not configured. Set STEAM_API_KEY." },
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
            "Private or inaccessible profile. Make your profile public in Steam settings.",
        },
        { status: 403 }
      );
    }

    console.error("[Kingdom Hearts API Error]", err);

    return NextResponse.json(
      { error: "Error fetching achievements. Try again later." },
      { status: 500 }
    );
  }
}
