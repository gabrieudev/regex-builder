import { Footer } from "@/components/footer";
import { PrivateRouteProvider } from "@/providers/private-route";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrivateRouteProvider>
      <main>{children}</main>
      <Footer />
    </PrivateRouteProvider>
  );
}
