import * as yup from "yup";

export const productDetailSchema = yup.object().shape({
  selectedSize: yup
    .string()
    .required("サイズを選択してください"),
  
  quantity: yup
    .number()
    .min(1, "数量は1以上を選択してください")
    .required("数量を選択してください"),
});

export const checkoutSchema = yup.object().shape({
  lastName: yup
    .string()
    .required("姓を入力してください"),
  
  firstName: yup
    .string()
    .required("名を入力してください"),

  postalCode: yup
    .string()
    .required("郵便番号を入力してください"),
  
  prefecture: yup
    .string()
    .required("都道府県を入力してください"),
  
  city: yup
    .string()
    .required("市区町村を入力してください"),
  
  address: yup
    .string()
    .required("番地を入力してください"),
  
  building: yup
    .string()
    .optional()
    .default(''),

  email: yup
    .string()
    .required("メールアドレスを入力してください")
    .email("有効なメールアドレスを入力してください"),
  
  phone: yup
    .string()
    .required("電話番号を入力してください"),
  
  paymentMethod: yup
    .string()
    .required("支払い方法を選択してください")
    .oneOf(["credit", "cod"], "有効な支払い方法を選択してください"),
});

export type ProductDetailFormData = yup.InferType<typeof productDetailSchema>;
export type CheckoutFormData = yup.InferType<typeof checkoutSchema>;
