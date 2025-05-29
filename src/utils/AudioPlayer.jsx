import React, { useState, useEffect, useRef, useContext } from "react";
import stereo from "../assets/musicbg.jpg";
import { SongContext } from "../Context/SongContext";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { AiOutlineSound } from "react-icons/ai";
import { QueueContext } from "../Context/QueueContex";

const AudioPlayer = () => {
  const { song, audio, __URL__ } = useContext(SongContext);
  const { queue } = useContext(QueueContext);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1); // Volume state
  const [isDragging, setIsDragging] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const progressBar = useRef();

  useEffect(() => {
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      progressBar.current.max = audio.duration;
    });
    audio.addEventListener("timeupdate", () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
        progressBar.current.value = audio.currentTime;
      }
    });
    
    // Tự động phát bài tiếp theo khi bài hiện tại kết thúc
    audio.addEventListener("ended", handleNextSong);

    return () => {
      audio.removeEventListener("ended", handleNextSong);
    };
  }, [audio.src, isDragging, queue, currentSongIndex]);

  const togglePlayPause = () => {
    if (song.songUrl === "") return;
    if (audio.paused) audio.play();
    else audio.pause();
    song.setIsPlaying(!song.isPlaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    audio.volume = e.target.value;
  };

  const handleProgressChange = (e) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
  };

  const handleProgressStart = () => {
    setIsDragging(true);
  };

  const handleProgressEnd = () => {
    setIsDragging(false);
    if (audio) {
      audio.currentTime = currentTime;
      if (song.isPlaying) {
        audio.play();
      }
    }
  };

  const handleNextSong = () => {
    if (queue.length === 0) return;
    
    const nextIndex = (currentSongIndex + 1) % queue.length;
    const nextSong = queue[nextIndex];
    
    audio.pause();
    song.setSongName(nextSong.title);
    song.setArtistName(nextSong.artistName);
    song.setSongUrl(`${__URL__}/api/v1/stream/${nextSong.songSrc}`);
    audio.src = `${__URL__}/api/v1/stream/${nextSong.songSrc}`;
    audio.load();
    audio.play();
    song.setIsPlaying(true);
    setCurrentSongIndex(nextIndex);
  };

  const handlePreviousSong = () => {
    if (queue.length === 0) return;
    
    const prevIndex = currentSongIndex === 0 ? queue.length - 1 : currentSongIndex - 1;
    const prevSong = queue[prevIndex];
    
    audio.pause();
    song.setSongName(prevSong.title);
    song.setArtistName(prevSong.artistName);
    song.setSongUrl(`${__URL__}/api/v1/stream/${prevSong.songSrc}`);
    audio.src = `${__URL__}/api/v1/stream/${prevSong.songSrc}`;
    audio.load();
    audio.play();
    song.setIsPlaying(true);
    setCurrentSongIndex(prevIndex);
  };

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  return (
    <div className="fixed flex justify-around lg:justify-center lg:space-x-40 items-center bottom-0 right-0 left-0 bg-gray-900 text-white px-5 py-2 shadow-xl">
      <div className="flex space-x-5">
        <img src={stereo} alt="" className="rounded-lg w-12" />
        <div>
          <h3 className="text-lg">{song.songName}</h3>
          <p className="text-sm">{song.songArtist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <div className="flex space-x-3 lg:space-x-5">
          <button onClick={handlePreviousSong}>
            <FiSkipBack />
          </button>
          <button onClick={togglePlayPause}>
            {song.isPlaying ? <CiPause1 /> : <CiPlay1 />}
          </button>
          <button onClick={handleNextSong}>
            <FiSkipForward />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs">{calculateTime(currentTime)}</span>
          <input
            type="range"
            ref={progressBar}
            value={currentTime}
            min="0"
            max={duration}
            onChange={handleProgressChange}
            onMouseDown={handleProgressStart}
            onMouseUp={handleProgressEnd}
            onTouchStart={handleProgressStart}
            onTouchEnd={handleProgressEnd}
            className="w-64 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #4caf50 ${(currentTime / duration) * 100}%, #ccc 0%)`,
            }}
          />
          <span className="text-xs">{calculateTime(duration)}</span>
        </div>
      </div>

      <div className="hidden lg:flex space-x-5 items-center">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #4caf50 ${volume * 100}%, #ccc 0%)`,
          }}
        />
        <AiOutlineSound className="text-xl" />
      </div>
    </div>
  );
};

export default AudioPlayer;
