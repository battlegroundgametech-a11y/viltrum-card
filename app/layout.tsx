import "./globals.css";
import Providers from "./providers";
import { ToastProvider } from "../components/ToastProvider";

export const metadata = {
  title: "Viltrum Card",
  description: "Premium Crypto Card"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
