import CheckoutConfirmClient from "./CheckoutConfirmClient"; 
import { fetchSettings } from "@/lib/microcms";

export default async function CheckoutConfirmPage() {
  const settings = await fetchSettings();
  return (
    <CheckoutConfirmClient settings={settings} />
  )
} 