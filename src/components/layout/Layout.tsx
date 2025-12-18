import { ReactNode } from "react";
import { VerticalMenu } from "./VerticalMenu";
import { MobileLogo } from "./MobileLogo";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <MobileLogo />
      <VerticalMenu />
      <main className="flex-1 pb-16 md:pb-0 pt-20 md:pt-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};
