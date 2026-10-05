import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ReformCanvas } from "@/features/home/reform-canvas";
import { CapabilitiesStrip } from "@/features/home/capabilities-strip";
import { Manifesto } from "@/features/home/manifesto";
import { Expertise } from "@/features/home/expertise";
import { Products } from "@/features/home/products";
import { Approach } from "@/features/home/approach";
import { Contact } from "@/features/home/contact";
import { sectionIds } from "@/config/site";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id={sectionIds.main}>
        <ReformCanvas />
        <CapabilitiesStrip />
        <Manifesto />
        <Expertise />
        <Products />
        <Approach />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
