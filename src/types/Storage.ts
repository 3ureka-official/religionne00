import { OrderItem } from "@/firebase/orderService";

type PaymentInfo = {
  customerInfo: {
    customerInfo: {
      lastName: string;
      firstName: string;
      postalCode: string;
      prefecture: string;
      city: string;
      address: string;
      building: string;
      email: string;
      phone: string;
    },
    items: {
      id: string;
      name: string;
      description: string;
      price: number;
      quantity: number;
      image: string;
      size: string;
    }[],
    paymentMethod: string,
    shippingFee: number,
  }
  isIslandAddress: boolean;
}

type OrderInfo = {
  customerInfo: CustomerInfo,
  items: Item[],
  paymentMethod: string,
  shippingFee: number,
  total: number,
  isIslandAddress?: boolean
}


type CustomerInfo = {
  lastName: string;
  firstName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  building: string;
  email: string;
  phone: string;
}

type Item = {
  id: string;
  name: string;
  description?: string;
  price: string;
  quantity: number;
  image: string;
  size?: string;
}

type OrderData = {
  customer: string;
  email: string;
  phone: string;
  total: number;
  shippingFee: number;
  items: OrderItem[];
  address: {
    postalCode: string;
    prefecture: string;
    city: string;
    line1: string;
    line2: string;
  };
  paymentMethod: string;
}

export type { PaymentInfo, OrderInfo, CustomerInfo, Item, OrderData };

