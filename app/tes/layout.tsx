import SessionWrapper from "@/components/SessionWrapper";

export default function PengetesanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionWrapper>{children}</SessionWrapper>;
}
