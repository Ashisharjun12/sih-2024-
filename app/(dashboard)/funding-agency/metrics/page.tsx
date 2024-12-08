import { BurnRate } from "@/components/graphs/burnRate";
import { CustomerAcquisitionRate } from "@/components/graphs/customerAcquisitionRate";
import GrossMargin from "@/components/graphs/grossMargin";
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
