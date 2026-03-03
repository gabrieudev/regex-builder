import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PrivateRouteProvider } from "@/providers/private-route";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrivateRouteProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </PrivateRouteProvider>
  );
}
