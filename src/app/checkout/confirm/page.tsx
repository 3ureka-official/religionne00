import CheckoutConfirmClient from "./CheckoutConfirmClient"; 
import { fetchSettings } from "@/lib/microcms";

export const revalidate = 3600;

export default async function CheckoutConfirmPage() {
  const settings = await fetchSettings();
  return (
    <CheckoutConfirmClient settings={settings} />
  )
} 