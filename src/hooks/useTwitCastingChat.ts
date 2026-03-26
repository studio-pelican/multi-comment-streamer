import { useState, useEffect, useRef } from "react";
import type { NormalizedComment } from "@/app/overlay/page";

export function useTwitCastingChat(screenId: string | null, token: string | null) {
  const [comments, setComments] = useState<NormalizedComment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const currentMovieIdRef = useRef<string | null>(null);
  const lastSliceIdRef = useRef<number | null>(null);
  const isPollingRef = useRef(false);

  useEffect(() => {
    if (!screenId || !token) return;

    let timer: NodeJS.Timeout;
    let mounted = true;
    
    const headers = {
      "Accept": "application/json",
      "X-Api-Version": "2.0",
      "Authorization": `Bearer ${token}`
    };

    const fetchMovieId = async () => {
      try {
        const res = await fetch(`https://apiv2.twitcasting.tv/users/${screenId}`, { headers });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch user (${res.status}): ${text}`);
        }
        const data = await res.json();
        
        if (data.user && data.user.is_live && data.user.last_movie_id) {
          currentMovieIdRef.current = data.user.last_movie_id;
          setError(null);
          setIsConnected(true);
          if (mounted) pollMessages();
        } else {
          setError("TwitCasting: User is not live currently.");
          setIsConnected(false);
          timer = setTimeout(fetchMovieId, 30000); // 30秒ごとに配信開始をチェック
        }
      } catch (err: any) {
        setError(`TwitCasting Error: ${err.message}`);
        setIsConnected(false);
        timer = setTimeout(fetchMovieId, 15000);
      }
    };

    const pollMessages = async () => {
      if (!mounted) return;
      if (isPollingRef.current) return;
      isPollingRef.current = true;
      try {
        const url = new URL(`https://apiv2.twitcasting.tv/movies/${currentMovieIdRef.current}/comments`);
        url.searchParams.set("limit", "10");
        if (lastSliceIdRef.current !== null) {
          url.searchParams.set("slice_id", lastSliceIdRef.current.toString());
        }

        const res = await fetch(url.toString(), { headers });
        if (!res.ok) {
           throw new Error(`Chat Fetch Error: ${res.status}`);
        }
        const data = await res.json();
        setIsConnected(true);
        setError(null);

        // 初回フェッチ(lastSliceId === null)時は履歴として破棄し、以降から表示する
        if (data.comments && lastSliceIdRef.current !== null) {
          const newComments: NormalizedComment[] = data.comments.map((item: any) => ({
            id: item.id,
            platform: "twitcasting",
            authorName: item.from_user.name,
            authorIcon: item.from_user.image,
            message: item.message,
            timestamp: item.created * 1000,
          })).reverse(); // APIは降順（最新が先頭）なため昇順に戻す

          if (newComments.length > 0) {
            setComments(prev => {
              const merged = [...prev, ...newComments];
              return merged.slice(-50); // 最新の50件のみ保持
            });
          }
        }
        
        // slice_idの更新
        if (data.comments && data.comments.length > 0) {
          const highestId = Math.max(...data.comments.map((c: any) => parseInt(c.id)));
          lastSliceIdRef.current = highestId;
        }

        timer = setTimeout(() => {
          isPollingRef.current = false;
          pollMessages();
        }, 3000); // ツイキャスAPIのコメント取得は3秒間隔程度が安全
        return;

      } catch (err: any) {
        setError(`TwitCasting Poll Error: ${err.message}`);
        setIsConnected(false);
      }
      isPollingRef.current = false;
      timer = setTimeout(pollMessages, 6000);
    };

    fetchMovieId();

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [screenId, token]);

  return { comments, error, isConnected, clearComments: () => setComments([]) };
}
