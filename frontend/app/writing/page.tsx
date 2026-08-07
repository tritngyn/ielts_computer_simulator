import { PenTool } from "lucide-react";


export default function WritingTests() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-20">
        <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center border border-black/5 mb-8">
          <PenTool className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-5xl text-foreground mb-4 font-display">
          Writing Tests
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          We are preparing high-quality writing tasks with AI-powered scoring. Please check back soon.
        </p>
      </div>
    </div>
  );
}
