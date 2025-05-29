// This component is used to display the song card in the home page and the playlist page. The song card is used to display the song name, artist name, and the options to play, add to queue, add to playlist, and delete the song. The song card is also used to play the song when the user clicks on the song card.

//Importing libries
import React from "react";
import { useContext, useState, useRef } from "react";
import axios from "axios";
import { decodeToken } from "react-jwt";
import {  useNavigate } from "react-router-dom";

//Importing context
import { SongContext } from "../Context/SongContext";
import { FetchContext } from "../Context/FetchContext";
import { QueueContext } from "../Context/QueueContex";

//Importing icons
import { SlOptionsVertical } from "react-icons/sl";
import { MdDeleteOutline, MdOutlinePlaylistAdd, MdQueuePlayNext, MdAdd } from 'react-icons/md'
import { IoMdClose } from 'react-icons/io'
import musicbg from "../assets/musicbg.jpg";


const SongCard = ({ title, artistName, songSrc, userId, songId, file }) => {

  // Using context
  const { song, audio, __URL__ } = useContext(SongContext);
  const { setFetchSong } = useContext(FetchContext);
  const {dispatchQueue,dispatchList} = useContext(QueueContext)
  const navigate = useNavigate(); // Used to navigate to the playlist page

  const token = localStorage.getItem("access_token");
  let decoded;
  if(token) {decoded = decodeToken(token)};

  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [songDetails, setSongDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    artist: '',
    album: '',
    description: ''
  });

  // Display the options
  const displayOptions = () => {
    setShowOptions((prev) => !prev);
  };

  // Play the song when the user clicks on the song card
  const handlePlay = () => {
    song.setSongName(title);
    song.setArtistName(artistName);
    song.setSongUrl(`${__URL__}/api/v1/stream/${songSrc}`);
    audio.src = `${__URL__}/api/v1/stream/${songSrc}`;
    audio.load();
    audio.play();
    song.setIsPlaying(true)
  };

  const headers = {
    "x-auth-token": localStorage.getItem("access_token"),
  };

  // Delete the song
  const deleteSong = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${__URL__}/api/v1/song/delete/${songId}?file=${file}`,
        {
          headers,
        }
      );
      
      if (response.status === 200) {
        alert("Song deleted successfully");
        setFetchSong(prev => !prev); // Trigger re-fetch of songs
      }
    } catch (error) {
      console.error('Error deleting song:', error);
      alert("Failed to delete song");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      deleteSong();
    }
  };

  // Thêm nhạc vào playlist
  const handleAddToPlaylist = () => {
    dispatchList({type:'ADD_SONG',payload:{title,artistName,songSrc}})
    navigate("/playlists");
  };

  //Phát bài tiếp theo
  const handlePlayNext = () => {
    dispatchQueue({type:'ADD_TO_QUEUE',payload:{title,artistName,songSrc}})
  };

  const fetchSongDetails = async () => {
    try {
      console.log('Fetching details for song ID:', songId);
      const response = await axios.get(`${__URL__}/api/v1/song/${songId}`, {
        headers: {
          "x-auth-token": localStorage.getItem("access_token")
        }
      });
      console.log('API Response:', response.data);
      if (response.data.status === "success") {
        setSongDetails(response.data.song);
        setEditForm({
          title: response.data.song.title,
          artist: response.data.song.artist,
          album: response.data.song.album,
          description: response.data.song.description || ''
        });
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error fetching song details:', error.response || error);
      alert("Failed to fetch song details: " + (error.response?.data?.error || error.message));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Log the data we're about to send
      console.log('Sending edit request for song ID:', songId);
      console.log('Edit form data:', editForm);

      // Ensure we have a valid song ID
      if (!songId) {
        throw new Error('No song ID provided');
      }

      // Ensure we have a valid token
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `${__URL__}/api/v1/song/edit/${songId}`,
        {
          title: editForm.title.trim(),
          artist: editForm.artist.trim(),
          album: editForm.album.trim(),
          description: editForm.description.trim()
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token
          }
        }
      );

      console.log('Edit response:', response.data);

      if (response.data.status === "success") {
        // Update the song details in the modal
        setSongDetails({
          ...songDetails,
          ...editForm
        });
        setIsEditing(false);
        // Update the main song list
        setFetchSong(prev => !prev);
        alert("Song details updated successfully!");
      }
    } catch (error) {
      console.error('Error updating song:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
      
      if (error.response?.status === 401) {
        alert("Unauthorized - Only admin can edit songs");
      } else if (error.response?.status === 404) {
        alert("Song not found - Please check if the song still exists");
      } else {
        alert("Failed to update song: " + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isDeleting) {
    return (
      <div className="flex relative bg-gray-800 text-white justify-center items-center border-b-[1px] p-2 lg:w-[70vw] mx-auto">
        <p>Deleting song...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex relative bg-gray-800 text-white justify-between items-center border-b-[1px] p-2 lg:w-[70vw] mx-auto">
        <div onClick={handlePlay} className="flex space-x-5 cursor-pointer">
          <img src={musicbg} alt="" className="w-16" />
          <div className="text-sm lg:text-lg">
            <div>{title}</div>
            <div>{artistName}</div>
          </div>
        </div>

        {/* <---------------------------Desktop Options-------------------------> */}
        <div className="hidden lg:flex justify-start items-center p-2 space-x-5">
          <button onClick={fetchSongDetails}><MdAdd size={25}/></button>
          <button onClick={handleAddToPlaylist}><MdOutlinePlaylistAdd size={30}/></button>
          <button onClick={handlePlayNext}><MdQueuePlayNext size={25}/></button>
          {
            decoded == null ? <></> : (decoded.id === userId || decoded.isAdmin) ? (
              <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                <MdDeleteOutline size={25}/>
              </button>
            ) : (<></>)
          }
        </div>

        {/* <---------------------------Mobile Options-------------------------> */}
        <div
          onClick={displayOptions}
          onMouseOut={() => setShowOptions(false)}
          className="relative block lg:hidden"
        >
          <SlOptionsVertical size={15} />
        </div>
        {showOptions && (
          <div className="absolute right-0 z-10 w-36 bg-gray-900 ">
            <ul className="flex justify-start flex-col items-start space-y-2 p-2">
              <button onClick={fetchSongDetails}>View Details</button>
              <button onClick={handleAddToPlaylist}>Add to playlist</button>
              <button onClick={handlePlayNext}>play next</button>
              {
                decoded == null ? <></> : (decoded.id === userId || decoded.isAdmin) ? (
                  <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                ) : (<></>)
              }
            </ul>
          </div>
        )}
      </div>

      {/* Song Details Modal */}
      {showDetails && songDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl w-[90%] max-w-md relative shadow-2xl transform transition-all duration-300 ease-in-out scale-100 hover:scale-[1.02]">
            <button 
              onClick={() => {
                setShowDetails(false);
                setIsEditing(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <IoMdClose size={24} />
            </button>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-purple-500 shadow-lg">
                <img src={musicbg} alt="" className="w-full h-full object-cover" />
              </div>
              {!isEditing ? (
                <>
                  <h2 className="text-3xl font-bold text-white mb-1 text-center">{songDetails.title}</h2>
                  <p className="text-purple-400 text-lg">{songDetails.artist}</p>
                </>
              ) : null}
            </div>
            
            {!isEditing ? (
              <div className="space-y-4 text-gray-300">
                <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                  <span className="font-semibold text-purple-400 block mb-1">Album</span>
                  <p className="text-white">{songDetails.album}</p>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                  <span className="font-semibold text-purple-400 block mb-1">Description</span>
                  <p className="text-gray-300 leading-relaxed">{songDetails.description}</p>
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                  <button 
                    onClick={handlePlay}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>Play Now</span>
                  </button>
                  <button 
                    onClick={handleAddToPlaylist}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>Add to Playlist</span>
                  </button>
                  {decoded && decoded.isAdmin && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Artist</label>
                  <input
                    type="text"
                    name="artist"
                    value={editForm.artist}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Album</label>
                  <input
                    type="text"
                    name="album"
                    value={editForm.album}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 min-h-[100px]"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SongCard;
