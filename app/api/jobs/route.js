import { NextResponse } from "next/server";

const ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs/in/search/1";

export async function GET() {
    const params = new URLSearchParams({
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_API_KEY,
        results_per_page: "500",
        what: "developer",
    });

    const res = await fetch(`${ADZUNA_BASE_URL}?${params}`, {
        next: { revalidate: 1800 }, // 🔥 30 min cache
    });

    if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json(data.results);
}
