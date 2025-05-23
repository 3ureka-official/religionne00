
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
}


type CustomerInfo = {
  lastName: string;
  firstName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address: string;
  building: string;
}

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

export type { PaymentInfo, OrderInfo, CustomerInfo, Item };