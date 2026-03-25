"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useYouTubeChat } from "@/hooks/useYouTubeChat";
import { useTwitCastingChat } from "@/hooks/useTwitCastingChat";

export interface NormalizedComment {
  id: string;
  platform: "youtube" | "twitcasting";
  authorName: string;
  authorIcon: string;
  message: string;
  timestamp: number;
}

function OverlayContent() {
  const searchParams = useSearchParams();
  const [unifiedComments, setUnifiedComments] = useState<NormalizedComment[]>([]);
  
  const ytId = searchParams.get("yt");
  const tcId = searchParams.get("tc");
  const pos = searchParams.get("pos") || "left";
  const isRight = pos === "right";

  const topParam = searchParams.get("top");
  const bottomParam = searchParams.get("bottom");
  const top = topParam ? Math.max(0, Math.min(100, parseInt(topParam) || 0)) : 10;
  const bottom = bottomParam ? Math.max(0, Math.min(100, parseInt(bottomParam) || 0)) : 10;
  
  const [keys, setKeys] = useState({ ytKey: "", tcToken: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace(/^#/, "");
      const params = new URLSearchParams(hash);
      setKeys({
        ytKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "",
        tcToken: params.get("tcToken") || ""
      });
    }
  }, []);

  const yt = useYouTubeChat(ytId, keys.ytKey);
  const tc = useTwitCastingChat(tcId, keys.tcToken);

  useEffect(() => {
    setUnifiedComments(prev => {
      const existingIds = new Set(prev.map(c => c.id));
      const incoming = [...yt.comments, ...tc.comments].sort((a, b) => a.timestamp - b.timestamp);
      
      const novel = incoming.filter(c => !existingIds.has(c.id));
      if (novel.length === 0) return prev;
      
      const merged = [...prev, ...novel];
      
      // 最大30件残す
      if (merged.length > 30) {
        return merged.slice(merged.length - 30);
      }
      return merged;
    });
  }, [yt.comments, tc.comments]);

  // 古いコメントを自動パージする（60秒など）
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setUnifiedComments(prev => prev.filter(c => now - c.timestamp < 60000));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`w-full h-screen overflow-hidden p-6 flex flex-col justify-end text-white bg-transparent ${
      isRight ? "items-end" : "items-start"
    }`}>
      
      <div className={`absolute ${isRight ? "right-6" : "left-6"} flex flex-col gap-2 max-w-sm z-50 ${
        isRight ? "items-end" : "items-start"
      }`} style={{ top: `${top + 1}vh` }}>
        {ytId && !yt.isConnected && yt.error && (
          <div className="bg-slate-900/90 text-red-300 text-xs px-3 py-2 rounded shadow backdrop-blur-sm border border-red-900">
            {yt.error}
          </div>
        )}
        {tcId && !tc.isConnected && tc.error && (
          <div className="bg-slate-900/90 text-blue-300 text-xs px-3 py-2 rounded shadow backdrop-blur-sm border border-blue-900">
            {tc.error}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 overflow-hidden px-6 flex flex-col justify-end pointer-events-none" 
           style={{ top: `${top}vh`, bottom: `${bottom}vh` }}>
        <div className={`w-full flex flex-col justify-end pb-4 pointer-events-auto ${
          isRight ? "items-end" : "items-start"
        }`}>
        <AnimatePresence initial={false}>
          {unifiedComments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: isRight ? 20 : -20, scale: 0.95, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, x: 0, scale: 1, height: "auto", marginBottom: "0.75rem" }}
              exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0, transition: { duration: 0.3 } }}
              className={`p-3 rounded-xl shadow-lg flex items-start gap-3 w-full max-w-sm backdrop-blur-sm ${
                isRight ? "origin-right" : "origin-left"
              } ${
                comment.platform === "youtube" ? "bg-red-950/80 border border-red-800/60" : "bg-blue-950/80 border border-blue-800/60"
              }`}
              style={{ overflow: "hidden" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={comment.authorIcon} alt="" className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 object-cover border border-white/10" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm opacity-90 truncate leading-none text-slate-100">{comment.authorName}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider leading-none ${
                    comment.platform === "youtube" ? "bg-red-600/50 text-red-100" : "bg-blue-600/50 text-blue-100"
                  }`}>
                    {comment.platform === "youtube" ? "YT" : "TC"}
                  </span>
                </div>
                <p className="text-[15px] shadow-sm break-words leading-snug font-medium text-white">{comment.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function OverlayPage() {
  return (
    <Suspense fallback={<div className="bg-transparent" />}>
      <OverlayContent />
    </Suspense>
  );
}
