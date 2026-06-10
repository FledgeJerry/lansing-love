import { MetadataRoute } from "next";

const BASE = "https://lansing.love";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, priority: 1.0, changeFrequency: "daily" },
    { url: `${BASE}/submit`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/leaderboard`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/about`, priority: 0.5, changeFrequency: "monthly" },
  ];
}
