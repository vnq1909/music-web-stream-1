import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import SongCard from "../components/SongCard";
import { SidebarContext } from "../Context/SibebarContext";
import { FetchContext } from "../Context/FetchContext";
import { SongContext } from "../Context/SongContext";
import { QueueContext } from "../Context/QueueContex";
import { MdLibraryMusic, MdMusicNote } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const Songs = () => {
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const {fetchSong} = useContext(FetchContext);
  const {queue,list} = useContext(QueueContext);
  const {__URL__} = useContext(SongContext);
  
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState(null);

  useEffect(() => {
    if (showMenu) setShowMenu(false);
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${__URL__}/api/v1/songs`);
        setSongs(data["songs"]);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [fetchSong]);
 
  const closeMenu = () => {
    setShowMenu(false); 
  };

  return (
    <div 
      onClick={closeMenu} 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <MdLibraryMusic className="mx-auto h-16 w-16 text-purple-500" />
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">All Songs</h1>
          <p className="mt-2 text-gray-400">Discover and enjoy amazing music</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : songs && songs.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {songs.map((song, index) => (
                <motion.div
                  key={song._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="transform hover:scale-[1.02] transition-transform duration-200"
                >
                  <SongCard
                    title={song.title}
                    artistName={song.artist}
                    songSrc={song.song}
                    userId={song.uploadedBy}
                    songId={song._id}
                    file={song.file}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto">
              <MdMusicNote className="mx-auto h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-300">No Songs Found</h3>
              <p className="mt-2 text-gray-400">Start adding some music to your collection</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Songs;
