import TypeWriter from "@/components/TypeWriter";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="absolute top-1/2 w-full -translate-y-1/2 md:left-1/2 md:w-auto md:-translate-x-1/2">
        <h1 className="text-center text-4xl font-semibold md:text-7xl">
          Your todo <span className="text-teal-500">App</span> using{" "}
          <span className="text-teal-500">AI</span>
        </h1>
        <h2 className="my-10 text-center text-xl font-semibold text-slate-500 md:text-3xl">
          <TypeWriter />
        </h2>

        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button className="gap-2">{"Let's Go"}</Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-semibold text-slate-600">
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://kyhchn.vercel.app"
            className="text-pink-600 transition-colors hover:text-pink-400"
          >
            Kyhchn
          </a>
        </p>
      </div>
    </div>
  );
}
