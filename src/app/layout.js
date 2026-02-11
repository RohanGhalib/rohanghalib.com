import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from './providers';
import ThemeToggle from '@/components/ThemeToggle';
import GridBackground from '@/components/GridBackground';

export const metadata = {
  title: {
    default: "Rohan Ghalib - Portfolio",
    template: "%s | Rohan Ghalib"
  },
  description: "Rohan Ghalib is a Full Stack Developer & UI/UX Designer driven by innovation. Explore my portfolio of web applications, designs, and articles.",
  openGraph: {
    title: "Rohan Ghalib - Portfolio",
    description: "Rohan Ghalib is a Full Stack Developer & UI/UX Designer driven by innovation. Explore my portfolio of web applications, designs, and articles.",
    url: 'https://rohanghalib.com',
    siteName: 'Rohan Ghalib Portfolio',
    images: [
      {
        url: 'https://rohanghalib.com/profile.jpg', // Ensure this image exists in your public folder
        width: 1200,
        height: 630,
        alt: 'Rohan Ghalib Profile',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Rohan Ghalib - Portfolio",
    description: "Rohan Ghalib is a Full Stack Developer & UI/UX Designer driven by innovation.",
    images: ['https://rohanghalib.com/profile.jpg'], // Ensure this image exists
  },
  icons: {
    icon: '/favicon.ico', // Ensure you have a favicon
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Analytics />
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers>
          <GridBackground />
          <ThemeToggle />
          {children}
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
