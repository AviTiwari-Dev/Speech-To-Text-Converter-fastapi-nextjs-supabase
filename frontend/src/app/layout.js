import "./globals.css";
import { TranscriptProvider } from "@/context/TranscriptContext";

export const metadata = {
  title: "Speech To Text",
  description: "Speech transcription app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TranscriptProvider>{children}</TranscriptProvider>
      </body>
    </html>
  );
}
