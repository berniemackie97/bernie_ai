import "./globals.css";
import Provider from "./provider";
import ConvexClientProvider from "./ConvexClientProvider";

export const metadata = {
  title: "Bernie Code Assistant",
  description: "start up your ideas the easy way",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
          <Provider>{children}</Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
