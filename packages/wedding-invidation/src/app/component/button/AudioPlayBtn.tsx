import { useRef, useState, useEffect } from "react";

export default function AudioPlayBtn() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 오디오 엘리먼트 생성
    const audio = new Audio();
    audio.src = "/wedding-audio.mp3";
    audio.volume = 0.1;
    audio.loop = true;
    audioRef.current = audio;

    // 오디오 상태 이벤트 리스너
    audio.addEventListener("play", () => {
      console.log("오디오 재생됨 - 이벤트");
      setIsPlayingAudio(true);
    });

    audio.addEventListener("pause", () => {
      console.log("오디오 정지됨 - 이벤트");
      setIsPlayingAudio(false);
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 오디오 토글 함수 - 직접 재생/정지 수행
  const toggleAudio = () => {
    console.log("토글 버튼 클릭");
    if (!audioRef.current) return;

    // 현재 재생 중인지 확인하고 반대 동작 수행
    if (audioRef.current.paused) {
      console.log("재생 시도");
      try {
        // 재생 시도 - 성공하면 상태 변경은 이벤트 리스너에서 처리됨
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => console.log("재생 성공"))
            .catch((err) => {
              console.error("재생 실패:", err);
              // 실패해도 상태는 이벤트 리스너가 처리
            });
        }
      } catch (e) {
        console.error("재생 예외:", e);
      }
    } else {
      console.log("정지 시도");
      try {
        // 정지 시도 - 상태 변경은 이벤트 리스너에서 처리됨
        audioRef.current.pause();
      } catch (e) {
        console.error("정지 예외:", e);
      }
    }
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={toggleAudio}
        className="bg-white/30 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/50 transition-all"
        aria-label={isPlayingAudio ? "음악 일시정지" : "음악 재생"}
      >
        {isPlayingAudio ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>
    </div>
  );
}
