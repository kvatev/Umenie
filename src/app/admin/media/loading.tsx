import React from "react";
import { Loader2 } from "lucide-react";

export default function MediaLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-16 bg-white rounded-3xl p-6 shadow-sm border border-brand-purple/10" />
      <div className="h-14 bg-white rounded-3xl p-4 shadow-sm border border-brand-purple/10" />
      <div className="h-96 bg-white rounded-3xl p-6 shadow-sm border border-brand-purple/10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-brand-purple">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-heading font-bold">Зареждане на медийните файлове...</span>
        </div>
      </div>
    </div>
  );
}
