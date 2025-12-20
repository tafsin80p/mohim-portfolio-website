import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { VerticalMenu } from "./VerticalMenu";
import { MobileLogo } from "./MobileLogo";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <MobileLogo />}
      {!isDashboard && <VerticalMenu />}
      <main className={`flex-1 ${!isDashboard ? 'pb-16 md:pb-0 pt-20 md:pt-6' : ''}`}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};
