import InvestmentVsROI from "@/components/graphs/investmentVsROI";
import MultipleStartups from "@/components/graphs/multipleStartups";

export default function MetricsPage() {
  return (
    <>
      <MultipleStartups />
      <InvestmentVsROI />
    </>
  );
}
