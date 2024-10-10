import React from "react";
import InitialLoading from "@/app/Components/ui/InitialLoading";

export default function Home() {
  return (
    <main className="flex h-screen ">
      <div className="m-auto">
        <InitialLoading />
      </div>
    </main>
  );
}
