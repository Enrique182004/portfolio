import { fetchRepos } from "@/lib/github";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const repos = await fetchRepos();
    return NextResponse.json(repos);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch repos" },
      { status: 500 },
    );
  }
}
