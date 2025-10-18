import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome to our Application</h1>
        <Button asChild size="lg">
        <Link href="/auth/login">ログイン / 新規登録</Link></Button>
      </div>
    </div>
  );
}
