import RecoilRootComponent from "@/components/context/recoilroot";
import { Toaster } from "sonner";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex w-full bg-white">{children}</div>;
}
