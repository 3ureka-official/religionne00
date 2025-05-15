import { Box, Container, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function ShoppingGuide() {
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
          ショッピングガイド
        </Typography>

        <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              お買い物について
            </Typography>
            <Typography variant="body1" paragraph>
              Religionne00では、オンラインショッピングを快適に楽しんでいただくため、以下のガイドラインを用意しております。
              ご注文方法や配送、返品・交換などについてご案内いたします。
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              よくあるご質問
            </Typography>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="subtitle1" fontWeight="medium">配送について</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  ご注文確定後、通常1-3営業日以内に発送いたします。配送方法は佐川急便または日本郵便を利用しており、
                  地域によって配送日数が異なります。配送状況はご注文確定後にお送りする追跡番号から確認可能です。
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  送料は全国一律550円（税込）です。10,000円以上のご購入で送料無料となります。
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography variant="subtitle1" fontWeight="medium">お支払い方法</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  以下のお支払い方法をご利用いただけます：
                </Typography>
                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                  <li>
                    <Typography variant="body2">クレジットカード（VISA、Mastercard、JCB、American Express）</Typography>
                  </li>
                  <li>
                    <Typography variant="body2">銀行振込</Typography>
                  </li>
                  <li>
                    <Typography variant="body2">コンビニ決済</Typography>
                  </li>
                  <li>
                    <Typography variant="body2">PayPay</Typography>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography variant="subtitle1" fontWeight="medium">返品・交換について</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  商品到着後7日以内に限り、未使用の商品であれば返品・交換を承ります。
                  返品・交換をご希望の場合は、お問い合わせフォームからご連絡ください。
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  ※以下の場合は返品・交換をお受けできませんのでご了承ください：
                </Typography>
                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                  <li>
                    <Typography variant="body2">お客様のご都合による破損・汚損</Typography>
                  </li>
                  <li>
                    <Typography variant="body2">商品タグを取り外した場合</Typography>
                  </li>
                  <li>
                    <Typography variant="body2">セール対象商品</Typography>
                  </li>
                </ul>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4a-content"
                id="panel4a-header"
              >
                <Typography variant="subtitle1" fontWeight="medium">サイズガイド</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  各商品ページに詳細なサイズ情報を記載しております。採寸方法や各サイズの詳細については、
                  商品詳細ページをご確認ください。サイズについてご不明な点がある場合は、お気軽にお問い合わせください。
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              お問い合わせ
            </Typography>
            <Typography variant="body1">
              ショッピングに関するご質問やお問い合わせは、<a href="/contact" style={{ color: 'black', textDecoration: 'underline' }}>お問い合わせフォーム</a>からお気軽にご連絡ください。
              営業時間内（平日10:00-18:00）に順次対応いたします。
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  )
} 