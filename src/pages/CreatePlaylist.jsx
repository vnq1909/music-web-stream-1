import React, { useEffect, useContext } from "react";
import axios from "axios";
import PlaylistCard from "../components/PlaylistCard";
import { SidebarContext } from "../Context/SibebarContext";
import { FetchContext } from "../Context/FetchContext";
import { SongContext } from "../Context/SongContext";
import { QueueContext } from "../Context/QueueContex";
import { MdPlaylistAdd, MdClose, MdLibraryMusic } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const CreatePlaylist = () => {
  const {fetchPlaylist} = useContext(FetchContext);
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const {__URL__} = useContext(SongContext);
  const {list} = useContext(QueueContext);
  const [createPlaylist, setCreatePlaylist] = React.useState(false);
  const [playlists, setPlaylists] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [playlistName, setPlaylistName] = React.useState("");

  const createCardOpen = () => setCreatePlaylist(true);
  const createCardClose = () => {
    setCreatePlaylist(false);
    setPlaylistName("");
  };

  const token = localStorage.getItem("access_token") || null;
  const headers = {
    "Content-Type": "application/json",
    "X-Auth-Token": token,
  };

  const createPlaylistHandler = async () => {
    if(!token) return alert("Please login to create a playlist");
    if (!playlistName.trim()) return alert("Please enter a playlist name");
    
    try {
      const {data, status} = await axios.post(
        `${__URL__}/api/v1/playlist/create`,
        { playlistName },
        { headers }
      );
      
      if(status === 200){
        alert("Playlist created successfully");
        setCreatePlaylist(false);
        setPlaylistName("");
        setLoading(true);
        await fetchPlaylists();
        setLoading(false);
      }
    } catch (error) {
      alert("Error creating playlist: " + error.message);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const { data } = await axios.get(`${__URL__}/api/v1/playlist`, { headers });
      setPlaylists(data["playlists"]);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    if (showMenu) setShowMenu(false);
    setLoading(true);
    fetchPlaylists();
    setLoading(false);
  }, [fetchPlaylist]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <MdLibraryMusic className="mx-auto h-16 w-16 text-purple-500" />
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Your Playlists</h1>
          <p className="mt-2 text-gray-400">Organize and enjoy your music collections</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : playlists && playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <motion.div
                key={playlist._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <PlaylistCard
                  playlistName={playlist.playlistName}
                  playlistId={playlist._id}
                  noSongs={playlist.songs.length}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto"
            >
              <MdLibraryMusic className="mx-auto h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-gray-300">No Playlists Found</h3>
              <p className="mt-2 text-gray-400">Create your first playlist to start organizing your music</p>
            </motion.div>
          </div>
        )}

        {/* Create Playlist Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={createCardOpen}
          className="fixed bottom-20 right-5 bg-purple-600 text-white rounded-full p-4 shadow-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors duration-200"
        >
          <MdPlaylistAdd size={24} />
          <span className="pr-2">Create Playlist</span>
        </motion.button>

        {/* Create Playlist Modal */}
        <AnimatePresence>
          {createPlaylist && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={createCardClose}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800/90 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/10"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Create New Playlist</h2>
                  <button
                    onClick={createCardClose}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <MdClose size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Playlist Name
                    </label>
                    <input
                      type="text"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      placeholder="Enter playlist name"
                      className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    onClick={createPlaylistHandler}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <MdPlaylistAdd size={20} />
                    <span>Create Playlist</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CreatePlaylist;
