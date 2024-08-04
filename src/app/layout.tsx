import { ReactNode } from "react";
import Navbar from "./Components/ui/Navbar";
import "./globals.css";
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>vijivati</title>
      </head>
      <body>
        <div className="flex flex-col justify-between min-h-screen">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default Layout;
