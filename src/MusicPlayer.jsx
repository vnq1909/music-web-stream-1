import React, { useRef, useState, useEffect, useContext } from "react";
import stereo from "./assets/stereo.jpg";
import { SongContext } from "./Context/SongContext";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { BiSkipNextCircle, BiSkipPreviousCircle } from "react-icons/bi";
import { HiPause } from "react-icons/hi";
import { QueueContext } from "./Context/QueueContex";

const MusicPlayer = () => {
  //References
  const audioRef = useRef();
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation

  //Context
  const { song, audio, __URL__ } = useContext(SongContext);
  const { queue } = useContext(QueueContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audio.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audio.pause();
      cancelAnimationFrame(animationRef.current);
    }
    song.setIsPlaying(!prevValue);
  };
  
  useEffect(() => {
    const seconds = Math.floor(audio.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;

    // Tự động phát bài tiếp theo khi bài hiện tại kết thúc
    audio.addEventListener("ended", nextSong);

    return () => {
      audio.removeEventListener("ended", nextSong);
    };
  }, [audio.duration, queue, currentSongIndex]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const whilePlaying = () => {
    progressBar.current.value = audio.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audio.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  // Next Song
  const nextSong = () => {
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
    setIsPlaying(true);
    song.setIsPlaying(true);
    setCurrentSongIndex(nextIndex);
  };

  // Previous Song
  const previousSong = () => {
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
    setIsPlaying(true);
    song.setIsPlaying(true);
    setCurrentSongIndex(prevIndex);
  };

  return (
    <div className="fixed bg-gray-200 bottom-0 right-0 left-0 px-5 flex justify-between items-center space-y-5">
      <div className="lg:block flex space-x-5">
        <img src={stereo} alt="" className="rounded-lg w-12 lg:w-24" />
        <div className="flex justify-center items-center flex-col">
          <h3 className="">{song.songName}</h3>
          <p className="">{song.songArtist}</p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-full">
        <input
          type="range"
          className="w-full"
          defaultValue="0"
          ref={progressBar}
          onChange={changeRange}
        />
        <div className="flex w-full justify-between">
          <p>{calculateTime(currentTime)}</p>
          <p>
            {duration && !isNaN(duration) ? calculateTime(duration) : "..."}
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <button onClick={previousSong}>
          <BiSkipPreviousCircle size={50} />
        </button>

        <button className="" onClick={togglePlayPause}>
          {isPlaying ? (
            <HiPause size={60} />
          ) : (
            <BsFillPlayCircleFill size={60} />
          )}
        </button>

        <button onClick={nextSong}>
          <BiSkipNextCircle size={50} />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
