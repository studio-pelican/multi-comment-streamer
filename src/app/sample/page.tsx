"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NormalizedComment {
  id: string;
  platform: "youtube" | "twitcasting";
  authorName: string;
  authorIcon: string;
  message: string;
  timestamp: number;
}

const DUMMY_POOL: Omit<NormalizedComment, "id" | "timestamp">[] = [
  {
    platform: "youtube",
    authorName: "ユーザーA",
    authorIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=A",
    message: "こんにちは！テストコメントです。",
  },
  {
    platform: "twitcasting",
    authorName: "ユーザーB",
    authorIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=B",
    message: "ツイキャスからのコメントテスト",
  },
  {
    platform: "youtube",
    authorName: "ユーザーC",
    authorIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=C",
    message: "このオーバーレイかっこいいですね！",
  },
  {
    platform: "twitcasting",
    authorName: "ユーザーD",
    authorIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=D",
    message: "草生えるｗｗｗ",
  },
  {
    platform: "youtube",
    authorName: "ユーザーE",
    authorIcon: "https://api.dicebear.com/7.x/avataaars/svg?seed=E",
    message: "8888888888888",
  },
];

function SampleOverlayContent() {
  const searchParams = useSearchParams();
  const pos = searchParams.get("pos") || "left";
  const isRight = pos === "right";

  const [unifiedComments, setUnifiedComments] = useState<NormalizedComment[]>([]);

  // 3秒ごとにランダムなコメントを追加
  useEffect(() => {
    const interval = setInterval(() => {
      const template = DUMMY_POOL[Math.floor(Math.random() * DUMMY_POOL.length)];
      const newComment: NormalizedComment = {
        ...template,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };

      setUnifiedComments((prev) => {
        const merged = [...prev, newComment];
        if (merged.length > 20) {
          return merged.slice(merged.length - 20);
        }
        return merged;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 60秒経過したコメントを削除
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setUnifiedComments((prev) => prev.filter((c) => now - c.timestamp < 60000));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`w-full h-screen overflow-hidden pt-[10vh] pb-[10vh] px-6 flex flex-col justify-end text-white bg-slate-900/10 ${
      isRight ? "items-end" : "items-start"
    }`}>
      <div className={`absolute top-4 ${isRight ? "right-4" : "left-4"} bg-slate-900/80 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-md`}>
        <h1 className="text-sm font-bold">サンプルコメント表示ページ</h1>
        <p className="text-[10px] opacity-70">URLパラメータ `pos=right` で右側に表示されます</p>
      </div>

      <div className={`w-full flex flex-col justify-end pb-4 ${
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
  );
}

export default function SampleOverlayPage() {
  return (
    <Suspense fallback={<div className="bg-transparent" />}>
      <SampleOverlayContent />
    </Suspense>
  );
}
