import React from "react";
import { useContext, useState } from "react";
import axios from 'axios'
import { SongContext } from "../Context/SongContext";
import { decodeToken } from "react-jwt";
import musicbg from "../assets/musicbg.jpg";
import { FetchContext } from "../Context/FetchContext";
import { MdPlayArrow, MdRemoveCircleOutline } from "react-icons/md";
import { motion } from "framer-motion";

const PlaylilstSong = ({ title, artistName, songSrc, playlistId }) => {
  const { song, audio, __URL__ } = useContext(SongContext);
  const { setFetchPlaylist } = useContext(FetchContext);
  const [isHovered, setIsHovered] = useState(false);
  const token = localStorage.getItem("access_token");
  const decoded = decodeToken(token);
 
  const handlePlay = () => {
    audio.pause();
    audio.src = `${__URL__}/api/v1/stream/${songSrc}`;
    song.songName = title;
    song.songArtist = artistName;
    song.songUrl = songSrc;
    audio.load();
    audio.play();
    song.setIsPlaying(true);
  };

  const headers = {
    "Content-Type": "application/json",
    "x-auth-token": localStorage.getItem("access_token"),
  };

  const removeSong = async () => {
    try {
      const { status } = await axios.delete(
        `${__URL__}/api/v1/playlist/remove/${playlistId}?song=${title}`,
        { headers }
      );
      if(status === 200) {
        alert('Song removed from the playlist');
        setFetchPlaylist(prev => !prev);
      }
    } catch (error) {
      console.error('Error removing song:', error);
      alert('Failed to remove song from playlist');
    }
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this song from the playlist?')) {
      removeSong();
    }
  };

  return (
    <motion.div
      className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-gray-700/40 transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center p-4">
        <div className="relative flex-shrink-0">
          <img 
            src={musicbg} 
            alt="" 
            className="w-16 h-16 rounded-lg object-cover"
          />
          {isHovered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg"
            >
              <MdPlayArrow className="text-white" size={32} />
            </motion.button>
          )}
        </div>
        
        <div className="ml-4 flex-grow">
          <h3 className="text-white font-medium truncate">{title}</h3>
          <p className="text-gray-400 text-sm">{artistName}</p>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          onClick={handleRemove}
          className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
        >
          <MdRemoveCircleOutline size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PlaylilstSong;
