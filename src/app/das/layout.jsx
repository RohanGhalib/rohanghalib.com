import { Noto_Nastaliq_Urdu } from 'next/font/google';

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
    <html lang="ur" dir="rtl" className={notoNastaliqUrdu.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
