import { NextRequest, NextResponse } from "next/server";

/**
 * Translates a single text using the free Google Translate GTX endpoint.
 * Preserves **bold** markers and line breaks.
 */
async function translateGtx(text: string, from = "bg", to = "en"): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text || "";

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      from
    )}&tl=${encodeURIComponent(to)}&dt=t&q=${encodeURIComponent(trimmed)}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`GTX translate returned status ${res.status}`);
      return text;
    }

    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0]
        .map((chunk: unknown) => (Array.isArray(chunk) && typeof chunk[0] === "string" ? chunk[0] : ""))
        .join("");

      // Fix any markdown spacing glitches e.g. "* *bold* *" -> "**bold**"
      const cleaned = translated
        .replace(/\*\s+\*/g, "**")
        .replace(/\s+\*\*/g, " **")
        .replace(/\*\*\s+/g, "** ");

      return cleaned || text;
    }

    return text;
  } catch (err) {
    console.error("GTX translation failed:", err);
    return text;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const from = (body.from || "bg").trim();
    const to = (body.to || "en").trim();

    // Single text translation
    if (typeof body.text === "string") {
      const translated = await translateGtx(body.text, from, to);
      return NextResponse.json({
        success: true,
        text: translated,
        translations: [translated],
      });
    }

    // Array of texts translation
    if (Array.isArray(body.texts)) {
      const translations = await Promise.all(
        body.texts.map((t: unknown) =>
          typeof t === "string" ? translateGtx(t, from, to) : ""
        )
      );
      return NextResponse.json({
        success: true,
        translations,
        text: translations[0] || "",
      });
    }

    return NextResponse.json(
      { success: false, message: "Липсва текст за превод (text или texts)." },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error("Translate API exception:", err);
    return NextResponse.json(
      { success: false, message: "Възникна грешка при автоматичния превод." },
      { status: 500 }
    );
  }
}
