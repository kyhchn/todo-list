import QueryClientProvider from "@/components/QueryClientProvider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryClientProvider>{children}</QueryClientProvider>;
}
