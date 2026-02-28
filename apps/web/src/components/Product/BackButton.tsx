"use client";

import { useRouter } from "next/navigation";
import { Button } from "@greenlink/ui";

export function BackButton() {
    const router = useRouter();
    return (
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-white/50 hover:bg-white rounded-full z-10"
            onClick={() => router.back()}
        >
            ←
        </Button>
    );
}
