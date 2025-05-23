import CheckoutClient from "./CheckoutClient"; 
import { fetchSettings } from "@/lib/microcms";

export default async function CheckoutPage() {
  const settings = await fetchSettings();
  return (
    <CheckoutClient settings={settings} />
  )
} 