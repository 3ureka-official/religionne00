import OrderCompleteClient from "./OrderCompleteClient";
import { fetchSettings } from "@/lib/microcms";

export default async function OrderCompletePage() {
  const settings = await fetchSettings();
  return (
    <OrderCompleteClient settings={settings} />
  )
} 