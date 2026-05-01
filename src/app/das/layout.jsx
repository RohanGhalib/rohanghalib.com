import { Noto_Nastaliq_Urdu } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: "Hifz Report DAS",
  description: "DAS Daily Hifz Report Portal",
};

export default function DasLayout({ children }) {
  return (
    <html lang="en" className={notoNastaliqUrdu.className}>
      <body>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
        {children}
      </body>
    </html>
  );
}
