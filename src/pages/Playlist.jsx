import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FetchContext } from "../Context/FetchContext";
import { SongContext } from "../Context/SongContext";
import PlaylilstSong from "../components/PlaylilstSong";
import { MdDeleteForever, MdPlaylistPlay, MdQueueMusic } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playList, setPlayList] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchPlaylist } = useContext(FetchContext);
  const { __URL__ } = useContext(SongContext);

  const headers = {
    "Content-Type": "application/json",
    "X-Auth-Token": localStorage.getItem("access_token"),
  };

  const deletePlaylist = async () => {
    setLoading(true);
    const { data, status } = await axios.delete(
      `${__URL__}/api/v1/playlist/delete/${id}`,
      { headers }
    );
    if (status === 200) {
      setLoading(false);
      alert("Playlist deleted successfully");
      navigate("/playlists");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylist();
    }
  };

  const getPlaylist = async () => {
    const { data } = await axios.get(
      `${__URL__}/api/v1/playlist/${id}`,
      { headers }
    );
    setPlayList(data["playlist"]);
  };

  useEffect(() => {
    getPlaylist();
  }, [fetchPlaylist]);

  if (loading || playList === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Playlist Header */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{playList.playlistName}</h1>
              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center">
                  <MdQueueMusic className="mr-2" />
                  <span>{playList.songs.length} songs</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full transition-colors duration-200"
              >
                <MdDeleteForever size={20} />
                <span>Delete Playlist</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Songs List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {playList.songs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto">
                  <MdPlaylistPlay className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-300">No Songs in Playlist</h3>
                  <p className="mt-2 text-gray-400">Add some songs to start listening</p>
                </div>
              </motion.div>
            ) : (
              playList.songs.map((song, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PlaylilstSong
                    title={song.title}
                    artistName={song.artistName}
                    songSrc={song.songSrc}
                    playlistId={id}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Playlist;
