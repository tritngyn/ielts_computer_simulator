import { BookOpenCheck } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-background/95 px-6 backdrop-blur-sm"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6 flex size-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-border" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-foreground" />
          <div className="flex size-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg">
            <BookOpenCheck className="size-6" aria-hidden="true" />
          </div>
        </div>

        <p className="font-display text-2xl text-foreground">IELTS Master</p>
        <p className="mt-2 text-sm text-muted-foreground">Đang tải nội dung...</p>

        <span className="sr-only">Trang mới đang được tải</span>
      </div>
    </main>
  );
}
