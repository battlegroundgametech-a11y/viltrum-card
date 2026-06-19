import "./globals.css";

export const metadata = {
  title: "Viltrum Card",
  description: "Premium crypto card experience on Sepolia testnet."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
