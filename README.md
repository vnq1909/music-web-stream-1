# 🎵 Music Streaming Web Application

A modern music streaming web application built with React.js frontend and Node.js backend, following the MVC architecture pattern. This project provides a complete music streaming experience with user authentication, playlist management, and real-time music playback.

## ✨ Features

### 🎧 Music Features
- **Music Streaming**: Real-time audio streaming with custom music player
- **Upload Songs**: Users can upload their own music files
- **Playlist Management**: Create, edit, and manage personal playlists
- **Song Library**: Browse and search through uploaded songs
- **Music Player Controls**: Play, pause, skip, volume control, and progress tracking

### 👤 User Management
- **User Registration & Login**: Secure authentication system
- **User Profiles**: Personal user accounts with profile management
- **Admin Panel**: Administrative interface for user management
- **Role-based Access**: Different permissions for regular users and administrators

### 🎨 User Interface
- **Responsive Design**: Modern, mobile-friendly interface
- **Smooth Animations**: Enhanced UX with Framer Motion animations
- **Intuitive Navigation**: Easy-to-use navigation and search

## 🛠️ Technologies Used

### Frontend
- **React.js 18**: Modern JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **Redux Toolkit**: State management for complex application state
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth transitions
- **React Icons**: Icon library for UI elements
- **Axios**: HTTP client for API communication

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MVC Architecture**: Model-View-Controller pattern for clean code organization
- **JWT (JSON Web Tokens)**: Secure authentication and authorization
- **bcryptjs**: Password hashing for security
- **Multer**: File upload handling
- **GridFS**: MongoDB file storage for large files
- **CORS**: Cross-origin resource sharing

### Database
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **GridFS**: MongoDB file system for storing music files

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Music-Stream
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Install Backend Dependencies
```bash
cd API
npm install
```

### Step 4: Environment Configuration
Create a `.env` file in the `API` directory:
```env
PORT=YourPort
MONGODB_URI=yourMongoDBURL
JWT_SECRET=your_jwt_secret_key
```

### Step 5: Start the Application

#### Development Mode
1. **Start Backend Server**:
   ```bash
   cd API
   npm start
   ```
   The backend will run on `http://localhost:1337`

2. **Start Frontend Development Server**:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

#### Production Mode
1. **Build Frontend**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   cd API
   npm start
   ```
   
## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 Author

**Võ Ngọc Quang** - Music Streaming Web Application

---

⭐ Star this repository if you find it helpful!
