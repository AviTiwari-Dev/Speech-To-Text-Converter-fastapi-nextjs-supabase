import "./globals.css";

import { ChatProvider } from "@/context/ChatContext";

import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Speech To Text",
  description: "Speech To Text App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ChatProvider>{children}</ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
