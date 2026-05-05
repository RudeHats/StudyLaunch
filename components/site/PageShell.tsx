import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { ReactNode } from "react";

export default function PageShell({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={dark ? "bg-background text-foreground" : "bg-background text-foreground"}>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
