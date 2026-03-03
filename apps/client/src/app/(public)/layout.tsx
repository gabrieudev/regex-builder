import { PublicRouteProvider } from "@/providers/public-route";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicRouteProvider>
      <main>{children}</main>
    </PublicRouteProvider>
  );
}
