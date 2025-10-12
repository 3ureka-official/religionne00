import * as yup from 'yup';

export const sizeInventorySchema = yup.object({
  size: yup.string()
    .required('サイズは必須です')
    .max(10, 'サイズは10文字以内で入力してください'),
  stock: yup.number()
    .required('在庫数は必須です')
    .min(1, '在庫数は1以上で入力してください')
    .typeError('在庫数は数値で入力してください'),
})

export const productSchema = yup.object({
  name: yup.string()
    .required('商品名は必須です')
    .max(40, '商品名は40文字以内で入力してください'),
  description: yup.string()
    .max(1000, '商品説明は1000文字以内で入力してください')
    .default(''),
  link: yup.string()
    .url('有効なURLを入力してください')
    .default(''),
  price: yup.number()
    .required('価格は必須です')
    .min(1, '価格を設定してください')
    .typeError('価格は数値で入力してください'),
  category: yup.array()
    .of(yup.string().required())
    .min(1, '少なくとも1つのカテゴリーを選択してください')
    .required('カテゴリーは必須です'),
  isPublished: yup.boolean().default(false),
  sizeInventories: yup.array()
    .of(sizeInventorySchema)
    .min(1, '少なくとも1つのサイズを設定してください')
    .required('サイズと在庫の設定は必須です'),
}).required();


export type ProductFormData = yup.InferType<typeof productSchema>;