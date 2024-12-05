import { BurnRate } from "@/components/graphs/burnRate";
import { CustomerAcquisitionRate } from "@/components/graphs/customerAcquisitionRate";
import GrossMargin from "@/components/graphs/grossMargin";
import InvestmentVsROI from "@/components/graphs/investmentVsROI";
import Revenue from "@/components/graphs/revenue";

export default function MetricsPage() {
  return (
    <>
      <Revenue />
      <BurnRate />
      <CustomerAcquisitionRate />
      <GrossMargin />
      <InvestmentVsROI />
    </>
  );
}
