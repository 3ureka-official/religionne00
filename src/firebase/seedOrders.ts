import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { Order } from './orderService';

const ORDERS_COLLECTION = 'orders';

// サンプル注文データ
const sampleOrders: Omit<Order, 'id'>[] = [
  {
    customer: '山田 太郎',
    email: 'yamada@example.com',
    phone: '090-1234-5678',
    date: serverTimestamp(),
    total: 12800,
    status: 'shipped',
    items: [
      {
        productId: 'product-1',
        name: 'プレミアムTシャツ',
        price: 6400,
        quantity: 2,
        image: '/images/products/tshirt.jpg',
        size: 'M'
      }
    ],
    address: {
      postalCode: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      line1: '丸の内1-1-1',
      line2: '東京ビル101'
    },
    paymentMethod: 'クレジットカード',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    customer: '佐藤 花子',
    email: 'sato@example.com',
    phone: '080-9876-5432',
    date: serverTimestamp(),
    total: 24500,
    status: 'processing',
    items: [
      {
        productId: 'product-2',
        name: 'デニムパンツ',
        price: 12500,
        quantity: 1,
        image: '/images/products/jeans.jpg',
        size: 'L'
      },
      {
        productId: 'product-3',
        name: 'カジュアルシャツ',
        price: 8000,
        quantity: 1,
        image: '/images/products/shirt.jpg',
        size: 'M'
      },
      {
        productId: 'product-4',
        name: 'ソックス',
        price: 2000,
        quantity: 2,
        image: '/images/products/socks.jpg',
        size: '25-27cm'
      }
    ],
    address: {
      postalCode: '460-0008',
      prefecture: '愛知県',
      city: '名古屋市中区',
      line1: '栄3-15-27',
      line2: 'サカエマンション205'
    },
    paymentMethod: '代金引換',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    customer: '鈴木 一郎',
    email: 'suzuki@example.com',
    phone: '070-1122-3344',
    date: serverTimestamp(),
    total: 18600,
    status: 'delivered',
    items: [
      {
        productId: 'product-5',
        name: 'スニーカー',
        price: 18600,
        quantity: 1,
        image: '/images/products/sneakers.jpg',
        size: '27.0cm'
      }
    ],
    address: {
      postalCode: '530-0001',
      prefecture: '大阪府',
      city: '大阪市北区',
      line1: '梅田2-2-2',
      line2: 'グランドハイツ梅田302'
    },
    paymentMethod: 'クレジットカード',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    customer: '田中 誠',
    email: 'tanaka@example.com',
    phone: '090-3344-5566',
    date: serverTimestamp(),
    total: 32000,
    status: 'pending',
    items: [
      {
        productId: 'product-6',
        name: 'レザージャケット',
        price: 32000,
        quantity: 1,
        image: '/images/products/jacket.jpg',
        size: 'L'
      }
    ],
    address: {
      postalCode: '812-0011',
      prefecture: '福岡県',
      city: '福岡市博多区',
      line1: '博多駅前4-4-4',
      line2: 'ハカタビル505'
    },
    paymentMethod: '銀行振込',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    customer: '伊藤 美咲',
    email: 'ito@example.com',
    phone: '080-7788-9900',
    date: serverTimestamp(),
    total: 5400,
    status: 'cancelled',
    items: [
      {
        productId: 'product-7',
        name: 'ニット帽',
        price: 3500,
        quantity: 1,
        image: '/images/products/beanie.jpg'
      },
      {
        productId: 'product-8',
        name: 'マフラー',
        price: 1900,
        quantity: 1,
        image: '/images/products/scarf.jpg'
      }
    ],
    address: {
      postalCode: '980-0021',
      prefecture: '宮城県',
      city: '仙台市青葉区',
      line1: '中央1-5-5',
      line2: 'センダイアパート101'
    },
    paymentMethod: 'コンビニ決済',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

// サンプルデータを追加する関数
export const seedOrders = async () => {
  try {
    console.log('注文サンプルデータの追加を開始します...');
    
    for (const order of sampleOrders) {
      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), order);
      console.log(`注文追加完了: ${docRef.id}`);
    }
    
    console.log('全ての注文データが正常に追加されました');
    return true;
  } catch (error) {
    console.error('注文データの追加に失敗しました:', error);
    throw error;
  }
};

// コマンドラインから直接実行された場合にデータ投入を実行
if (typeof window === 'undefined' && require.main === module) {
  seedOrders()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 