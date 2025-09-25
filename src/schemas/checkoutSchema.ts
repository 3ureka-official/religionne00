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
    .required("郵便番号を入力してください")
    .test("valid-postal-code", "有効な郵便番号を入力してください", (value) => {
      if (!value) return false;
      // ハイフンありの入力を許可
      if (!/^[\d-]+$/.test(value)) return false;
      // ハイフンを除去した数字が7桁であることを確認
      const digitsOnly = value.replace(/-/g, '');
      return digitsOnly.length === 7;
    }),
  
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
    .required("電話番号を入力してください")
    .test("valid-phone", "有効な電話番号を入力してください", (value) => {
      if (!value) return false;
      // 日本の携帯電話番号の形式をチェック（ハイフンあり・なし両方対応）
      const phoneRegex = /^(070|080|090)-?\d{4}-?\d{4}$|^050-?\d{4}-?\d{4}$/;
      return phoneRegex.test(value);
    }),
  
  paymentMethod: yup
    .string()
    .required("支払い方法を選択してください")
    .oneOf(["credit", "cod"], "有効な支払い方法を選択してください"),
});

export type ProductDetailFormData = yup.InferType<typeof productDetailSchema>;
export type CheckoutFormData = yup.InferType<typeof checkoutSchema>;
