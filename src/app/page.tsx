"use client";

import { useState, useEffect } from "react";
import { Copy, ExternalLink, Settings2, Youtube, Radio, CheckCircle } from "lucide-react";

export default function Home() {
  const [ytId, setYtId] = useState("");
  const [tcId, setTcId] = useState("");
  const [tcToken, setTcToken] = useState("");
  const [overlayUrl, setOverlayUrl] = useState("");

  const ytApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "";
  const tcClientId = process.env.NEXT_PUBLIC_TWITCASTING_CLIENT_ID || "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    // TwitCastingからのリダイレクト時 (Implicit Flow: /#access_token=...)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    
    if (accessToken) {
      localStorage.setItem("tc_access_token", accessToken);
      setTcToken(accessToken);
      // URLのハッシュをクリーンアップ
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      const savedToken = localStorage.getItem("tc_access_token");
      if (savedToken) setTcToken(savedToken);
    }

    const savedYtId = localStorage.getItem("yt_video_id");
    const savedTcId = localStorage.getItem("tc_screen_id");
    if (savedYtId) setYtId(savedYtId);
    if (savedTcId) setTcId(savedTcId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("yt_video_id", ytId);
    localStorage.setItem("tc_screen_id", tcId);

    const url = new URL(window.location.href);
    url.pathname = "/overlay";
    if (ytId) url.searchParams.set("yt", ytId);
    if (tcId) url.searchParams.set("tc", tcId);
    
    // TwitCastingのトークンはOBS上でも必要なため、ハッシュに含めて渡す
    const hashParams = new URLSearchParams();
    if (tcToken) hashParams.set("tcToken", tcToken);
    url.hash = hashParams.toString();
    
    setOverlayUrl(url.toString());
  }, [ytId, tcId, tcToken]);

  const handleTcLogin = () => {
    if (!tcClientId) {
      alert("環境変数 NEXT_PUBLIC_TWITCASTING_CLIENT_ID が設定されていません。");
      return;
    }
    // フロントエンドのみ実装のため Implicit flow (response_type=token) が必須になります
    // ※ response_type=code はバックエンド(Node.jsサーバー側)で secret と交換する処理が必要です
    const authUrl = `https://apiv2.twitcasting.tv/oauth2/authorize?client_id=${tcClientId}&response_type=token`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-8">
      <main className="max-w-3xl mx-auto p-6 space-y-8">
        <header className="space-y-2 mt-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings2 className="w-8 h-8 text-blue-400" />
            Comment Overlay Setup
          </h1>
          <p className="text-slate-400">YouTube Live と ツイキャスのコメントを統合表示するOBS用オーバーレイ</p>
        </header>

        <section className="bg-slate-800 p-6 rounded-xl space-y-4 border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold border-b border-slate-700 pb-2">1. 環境変数の確認</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-48 text-slate-400">YouTube API Key:</span>
              {ytApiKey ? <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> 設定済み</span> : <span className="text-red-400">未設定 (.env.local)</span>}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-48 text-slate-400">TwitCasting Client ID:</span>
              {tcClientId ? <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> 設定済み</span> : <span className="text-red-400">未設定 (.env.local)</span>}
            </div>
          </div>
        </section>

        <section className="bg-slate-800 p-6 rounded-xl space-y-4 border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold border-b border-slate-700 pb-2">2. ツイキャス連携</h2>
          <p className="text-sm text-slate-400 mb-2">
            ツイキャスのコメントを取得するため、配信に連携するアカウントでログイン（アクセス許可）してください。
          </p>
          {tcToken ? (
            <div className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-700">
               <span className="text-green-400 font-medium flex items-center gap-2">
                 <CheckCircle className="w-5 h-5"/> 連携済み (アクセストークン保持中)
               </span>
               <button onClick={() => { localStorage.removeItem("tc_access_token"); setTcToken(""); }} className="text-sm text-red-400 hover:text-red-300">
                 連携解除
               </button>
            </div>
          ) : (
            <button
               onClick={handleTcLogin}
               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors w-full sm:w-auto"
            >
              ツイキャスでログインして連携
            </button>
          )}
        </section>

        <section className="bg-slate-800 p-6 rounded-xl space-y-4 border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold border-b border-slate-700 pb-2">3. 配信情報の入力</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" /> YouTube Video ID
              </label>
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="例: dQw4w9WgXcQ"
                value={ytId}
                onChange={(e) => setYtId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-400" /> ツイキャス Screen ID
              </label>
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="例: cas_taro"
                value={tcId}
                onChange={(e) => setTcId(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-800 p-6 rounded-xl space-y-4 border border-slate-700 shadow-xl">
          <h2 className="text-xl font-semibold border-b border-slate-700 pb-2">4. オーバーレイURL</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={overlayUrl}
              className="flex-1 bg-slate-900 text-green-400 font-mono text-sm border border-slate-600 rounded-lg px-4 py-3 outline-none"
            />
            <button
              onClick={() => {
                if (overlayUrl) {
                  navigator.clipboard.writeText(overlayUrl);
                  alert("URLをコピーしました！OBSのブラウザソースのURLに貼り付けてください。");
                }
              }}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              title="URLをコピー"
            >
              <Copy className="w-5 h-5" />
            </button>
            <a
              href={overlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors inline-block"
              title="別タブで開く"
            >
              <ExternalLink className="w-5 h-5 text-white" />
            </a>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            ※OBSの「ブラウザ」ソースでこのURLを指定し、幅を <code className="bg-slate-900 px-1 rounded">1920</code>、高さを <code className="bg-slate-900 px-1 rounded">1080</code> に設定してください。
          </p>
        </section>
      </main>
    </div>
  );
}
