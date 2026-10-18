import type { Metadata } from "next";
import LiveCam from "../components/LiveCam";

export const metadata: Metadata = {
  title: "Live Cam | Lanka Meet",
  description: "Find Lanka Meet advertisers who are open to video calls and contact them directly.",
};

export default function LiveCamPage() {
  return <LiveCam />;
}
