import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link"; // ✅ Add this import

export default function HomePage() {
  return (
    <div className="p-6">
      <SignedIn>
        <h1 className="text-xl font-bold">Welcome to Crossword Battle Arena!</h1>
        <UserButton afterSignOutUrl="/sign-in" />

        {/* ✅ Wrap the button inside a Link */}
        <Link href="/game">
          <button className="mt-4 p-2 bg-blue-500 text-white rounded">
            Start New Game
          </button>
        </Link>
      </SignedIn>

      <SignedOut>
        <h1>You are signed out.</h1>
        <p>
          <a href="/sign-in" className="text-blue-600 underline">Sign in</a> to start playing.</p>
      </SignedOut>
    </div>
  );
}
