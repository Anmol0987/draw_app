"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function Home() {
  const [CanvasId, setCanvasId] = useState("");
  const router = useRouter();
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="flex flex-col gap-2">
        <input className="p-4 text-black" onChange={(e) => {
          setCanvasId(e.target.value);
        }
        } type="text" placeholder="CanvasId" />
        <button className="p-4 bg-blue-500" onClick={() => {
          router.push(`/canvas/${CanvasId}`);
        }
        }>Join</button>
      </div>

    </div>
  );
}
