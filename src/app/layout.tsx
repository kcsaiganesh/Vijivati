import { ReactNode } from "react";
import "./globals.css";
import { Montserrat } from "next/font/google";

interface LayoutProps {
  children: ReactNode;
}

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>vijivati</title>
      </head>
      <body className={`${montserrat.className}`}>
        <div className="flex flex-col justify-between min-h-screen">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default Layout;
