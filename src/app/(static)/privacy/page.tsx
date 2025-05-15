import { Box, Container, Typography, Paper, Divider } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPolicy() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F8F9FA'
      }}
    >
      <Header />
      <Container maxWidth="lg" component="main" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          textAlign: 'center',
          mb: 4,
          fontWeight: 500
        }}>
          プライバシーポリシー
        </Typography>

        <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
          <Typography variant="body2" paragraph sx={{ mb: 4 }}>
            最終更新日: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              1. はじめに
            </Typography>
            <Typography variant="body1" paragraph>
              Religionne00（以下、「当社」といいます）は、お客様のプライバシーを尊重し、個人情報の保護に努めています。
              このプライバシーポリシーでは、当社のウェブサイトやサービスをご利用いただく際に収集する情報と、
              その利用方法についてご説明します。
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              2. 収集する情報
            </Typography>
            <Typography variant="body1" paragraph>
              当社は、以下の情報を収集することがあります：
            </Typography>
            <ul style={{ paddingLeft: '20px' }}>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>個人情報：</strong>氏名、住所、電話番号、メールアドレス、生年月日など、お客様を特定できる情報
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>取引情報：</strong>購入履歴、配送情報、支払い情報など
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>利用情報：</strong>当社ウェブサイトの閲覧履歴、IPアドレス、ブラウザの種類、参照元ウェブサイトなど
                </Typography>
              </li>
            </ul>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              3. 情報の利用目的
            </Typography>
            <Typography variant="body1" paragraph>
              収集した情報は、以下の目的で利用します：
            </Typography>
            <ul style={{ paddingLeft: '20px' }}>
              <li>
                <Typography variant="body1" paragraph>
                  商品の配送、支払い処理、注文確認などの取引の実行
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  カスタマーサポートの提供
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  新商品、セール、イベントなどの情報提供（お客様の同意がある場合）
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  ウェブサイトの改善、利用状況の分析
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  不正行為の防止および検出
                </Typography>
              </li>
            </ul>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              4. 情報の共有
            </Typography>
            <Typography variant="body1" paragraph>
              当社は、以下の場合を除き、お客様の個人情報を第三者と共有することはありません：
            </Typography>
            <ul style={{ paddingLeft: '20px' }}>
              <li>
                <Typography variant="body1" paragraph>
                  お客様の同意がある場合
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  商品の配送、支払い処理などのサービス提供に必要な場合
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  法律上の義務がある場合
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  当社の権利や財産を保護する必要がある場合
                </Typography>
              </li>
            </ul>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              5. お客様の権利
            </Typography>
            <Typography variant="body1" paragraph>
              お客様は、当社が保有するご自身の個人情報について、以下の権利を有しています：
            </Typography>
            <ul style={{ paddingLeft: '20px' }}>
              <li>
                <Typography variant="body1" paragraph>
                  個人情報へのアクセス、訂正、削除を要求する権利
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  マーケティング目的での情報利用に対する同意を撤回する権利
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  データポータビリティの権利（技術的に可能な場合）
                </Typography>
              </li>
            </ul>
            <Typography variant="body1" paragraph>
              これらの権利を行使したい場合は、お問い合わせフォームからご連絡ください。
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h6" component="h2" gutterBottom>
              6. お問い合わせ
            </Typography>
            <Typography variant="body1" paragraph>
              プライバシーポリシーに関するご質問やお問い合わせは、
              <a href="/contact" style={{ color: 'black', textDecoration: 'underline' }}>お問い合わせフォーム</a>
              からお気軽にご連絡ください。
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  )
} 