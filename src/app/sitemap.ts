import { MetadataRoute } from "next";

const BASE = "https://lansing.love";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, priority: 1.0, changeFrequency: "daily" },
    { url: `${BASE}/predictions`, priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/governance`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/governance/roadmap`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/governance/dashboard`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/leaderboard`, priority: 0.6, changeFrequency: "weekly" },
    { url: `${BASE}/about`, priority: 0.5, changeFrequency: "monthly" },
  ];
}
