import { useState, useEffect, useRef } from "react";
import type { NormalizedComment } from "@/app/overlay/page";

export function useYouTubeChat(videoId: string | null, apiKey: string | null) {
  const [comments, setComments] = useState<NormalizedComment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const liveChatIdRef = useRef<string | null>(null);
  const nextPageTokenRef = useRef<string | null>(null);
  const isPollingRef = useRef(false);

  useEffect(() => {
    if (!videoId || !apiKey) return;

    let timer: NodeJS.Timeout;
    let mounted = true;

    const fetchChatId = async () => {
      try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${apiKey}`);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const detail = data.items[0].liveStreamingDetails;
          if (detail && detail.activeLiveChatId) {
            liveChatIdRef.current = detail.activeLiveChatId;
            setIsConnected(true);
            setError(null);
            if (mounted) pollMessages();
          } else {
            setError("YouTube: No active live chat found for this video.");
          }
        } else {
          setError("YouTube: Video not found or API quota exceeded.");
        }
      } catch (err: any) {
        setError(`YouTube Error: ${err.message}`);
      }
    };

    const pollMessages = async () => {
      if (!mounted) return;
      if (isPollingRef.current) return;
      isPollingRef.current = true;
      try {
        const url = new URL("https://www.googleapis.com/youtube/v3/liveChat/messages");
        url.searchParams.set("liveChatId", liveChatIdRef.current!);
        url.searchParams.set("part", "snippet,authorDetails");
        url.searchParams.set("key", apiKey);
        if (nextPageTokenRef.current) {
          url.searchParams.set("pageToken", nextPageTokenRef.current);
        }

        const res = await fetch(url.toString());
        const data = await res.json();

        if (data.error) {
          setError(`YouTube API Error: ${data.error.message}`);
          setIsConnected(false);
        } else {
          setError(null);
          setIsConnected(true);
          // 最初のフェッチ時は履歴をスキップし、nextPageTokenのみ保持する
          if (data.items && nextPageTokenRef.current) {
            const newComments: NormalizedComment[] = data.items.map((item: any) => ({
              id: item.id,
              platform: "youtube",
              authorName: item.authorDetails.displayName,
              authorIcon: item.authorDetails.profileImageUrl,
              message: item.snippet.textMessageDetails?.messageText || item.snippet.displayMessage,
              timestamp: new Date(item.snippet.publishedAt).getTime(),
            }));
            
            if (newComments.length > 0) {
              setComments(prev => [...prev, ...newComments]);
            }
          }
          nextPageTokenRef.current = data.nextPageToken;
          
          const pollingIntervalMillis = data.pollingIntervalMillis || 3000;
          timer = setTimeout(() => {
            isPollingRef.current = false;
            pollMessages();
          }, pollingIntervalMillis);
          return;
        }
      } catch (err: any) {
        setError(`YouTube Poll Error: ${err.message}`);
        setIsConnected(false);
      }
      isPollingRef.current = false;
      timer = setTimeout(pollMessages, 10000);
    };

    fetchChatId();

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [videoId, apiKey]);

  return { comments, error, isConnected, clearComments: () => setComments([]) };
}
