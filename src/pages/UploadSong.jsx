import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
// import { redirect } from "react-router-dom";
import { SidebarContext } from "../Context/SibebarContext";
import { useNavigate } from "react-router-dom";
import { SongContext } from "../Context/SongContext";
import { MdCloudUpload, MdLibraryMusic } from 'react-icons/md';
import { motion } from 'framer-motion';

const UploadSong = () => {
  const navigate = useNavigate();
  // we are using this to close the sidebar when we land on this page
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const {__URL__} = useContext(SongContext)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (showMenu) setShowMenu(false);
  }, []);

  // we are using this to upload the file
  const [file, setFile] = useState();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // we are using this to handle the file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
    } else {
      alert('Please select an audio file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
    } else {
      alert('Please drop an audio file');
    }
  };

  // we are using this to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("album", album);
    formData.append("description", description);

    try {
      const result = await axios.post(
        `${__URL__}/api/v1/song/upload`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
            "x-auth-token": localStorage.getItem("access_token"),
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );

      // if the file is uploaded successfully, we will redirect the user to the home page with alert message
      if (result.status === 201) {
        alert("File uploaded successfully");
        navigate("/explore");
      }
    } catch (error) {
      alert("Error uploading file: " + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-12">
          <MdLibraryMusic className="mx-auto h-16 w-16 text-purple-500" />
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Upload Your Music</h1>
          <p className="mt-2 text-gray-400">Share your music with the world</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10"
        >
          <div className="space-y-6">
            {/* File Upload Area */}
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center ${
                dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-purple-500/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept="audio/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <MdCloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-400">
                {file ? file.name : "Drag and drop your audio file here, or click to select"}
              </p>
            </div>

            {/* Song Details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-lg bg-gray-700/50 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter song title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Artist</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="mt-1 block w-full rounded-lg bg-gray-700/50 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter artist name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Album</label>
                <input
                  type="text"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  className="mt-1 block w-full rounded-lg bg-gray-700/50 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter album name"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="mt-1 block w-full rounded-lg bg-gray-700/50 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter song description"
                  required
                />
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                        Uploading
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-purple-600">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                    <div
                      style={{ width: `${uploadProgress}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={!localStorage.getItem("access_token") || isUploading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                  ${isUploading 
                    ? 'bg-purple-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                  }`}
              >
                {isUploading ? 'Uploading...' : 'Upload Song'}
              </button>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default UploadSong;
