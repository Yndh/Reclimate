import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className=" text-9xl md:text-[300px] h-fit font-bold mb-0 pb-0">
        404
      </h1>
      <p className="-translate-y-4 text-lg md:text-xl text-muted-foreground">
        Oops! Wygląda na to, że ta strona nie istnieje
      </p>
      <Link href={"/app"}>
        <Button variant={"outline"} className=" text-xl font-bold px-8 py-6">
          Wróć do aplikacji
        </Button>
      </Link>
    </div>
  );
}
