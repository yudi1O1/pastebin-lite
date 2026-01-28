export const metadata = {
  title: "Pastebin Lite",
  description: "Pastebin Lite Assignment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
