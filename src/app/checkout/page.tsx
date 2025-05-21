import CheckoutClientPage from "./CheckoutClient";
import { fetchSettings } from "@/lib/microcms";

export default async function CheckoutPage() {
  const settings = await fetchSettings();
  return (
    <CheckoutClientPage settings={settings} />
  )
} 