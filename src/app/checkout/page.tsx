import CheckoutClient from "./CheckoutClient"; 
import { fetchSettings } from "@/lib/microcms";

export const revalidate = 3600;

export default async function CheckoutPage() {
  const settings = await fetchSettings();
  return (
    <CheckoutClient settings={settings} />
  )
} 