import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
    metadataBase: new URL("https://tstechcanopy.com"),
    title: "TS Technology — Strength. Style. Protection.",
    description:
        "Premium tech accessories in Kolkata. Mobile covers, chargers, cables, earphones, laptop accessories, smartwatches, power banks and more.",
    keywords:
        "tech accessories, mobile covers, chargers, cables, earphones, laptop accessories, smartwatches, power banks, Kolkata",
    openGraph: {
        title: "TS Technology",
        description: "Premium tech accessories — Strength. Style. Protection.",
        images: [
            {
                url: "/images/WhatsApp_Image_2026-07-12_at_14.52.06 copy copy.jpeg",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en' className='dark' suppressHydrationWarning>
            <head>
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link
                    rel='preconnect'
                    href='https://fonts.gstatic.com'
                    crossOrigin='anonymous'
                />
                <link
                    href='https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
                    rel='stylesheet'
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
                    }}
                />
            </head>
            <body
                className='antialiased'
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
