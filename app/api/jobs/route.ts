import { NextResponse } from "next/server";

const COUNTRY_MAP: Record<string, string> = {
    India: "in",
    "United States": "us",
    Canada: "ca",
    "United Kingdom": "gb",
    Germany: "de",
    Australia: "au",
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const what = searchParams.get("what") || "";
    const location = searchParams.get("location") || "India";

    const countryCode = COUNTRY_MAP[location] || "in";

    const params = new URLSearchParams({
        app_id: process.env.ADZUNA_APP_ID!,
        app_key: process.env.ADZUNA_API_KEY!,
        results_per_page: "50",
    });

    if (what) {
        params.set("what", what);
    }

    const res = await fetch(
        `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?${params}`,
        { next: { revalidate: 1800 } }
    );

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json(data.results);
}
