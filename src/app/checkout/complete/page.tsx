import { Suspense } from 'react';
import OrderCompleteClient from "./OrderCompleteClient";
import { fetchSettings } from "@/lib/microcms";

export const revalidate = 3600;

export default async function OrderCompletePage() {
  const settings = await fetchSettings();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderCompleteClient settings={settings} />
    </Suspense>
  )
} 