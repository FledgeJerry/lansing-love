import type { Metadata } from "next";
import CostCalculator from "./CostCalculator";

export const metadata: Metadata = {
  title: "Unhoused Cost Calculator",
  description: "An interactive estimate of what homelessness costs a typical Lansing household today, compared against a Housing First model — adjust the sliders to reflect local data.",
  alternates: { canonical: "/unhoused-cost-calculator" },
  openGraph: { title: "Unhoused Cost Calculator | lansing.love", description: "What does homelessness cost a Lansing household? An interactive Housing First comparison.", url: "https://lansing.love/unhoused-cost-calculator" },
};

export default function UnhousedCostCalculatorPage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <CostCalculator />
    </div>
  );
}
