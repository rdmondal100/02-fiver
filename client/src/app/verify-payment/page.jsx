import dynamic from "next/dynamic";

const VerifyPayment = dynamic(
  () => import("@/components/verify-payment/VerifyPayment"),
  { ssr: false }
);

export default function Page() {
  return <VerifyPayment />;
}
