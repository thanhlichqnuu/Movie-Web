# Movie Streaming Website Using Vue 3

This is a movie streaming web application built with Vue 3. The application allows users to view movie lists, search for movies by name, view detailed information, and watch episodes.

## Main Feature

- View lists of popular movies.
- Search for movies by name.
- Filter movies by criteria: Genre, country, status, release year.
- View movie information.
- Watch movie trailers.
- Watch movie episodes.

## Technologies Used

- **Vue 3**: Main framework for building applications.
- **Vuetify**: Library for building UI.
- **Axios**: HTTP Client library for making API requests.
- **Pinia**: Library for state management.
- **SWRV**: Library for handling caching.
- **ArtPlayer.js**: Library for supporting episode playback.
- **Hls.js**: Library for handling m3u8 file.
- **Apii Online API**: Movie data source.

## Installation and Running the Application

### System Requirements

- Node.js >= 20.x
- npm >= 10.x

### Installation Guide

1. Clone the repository to your machine:
```
git clone https://github.com/thanhlichqnuu/Movie-Web.git
```
Install the dependencies:
```
cd app
npm install
```
Run the application:
```
npm run serve
```
Open your browser and navigate to:
```
http://localhost:8080
```
```
├── public          # Folder containing static files
├── src
│   ├── assets      # Folder containing assets like images and CSS
│   ├── components  # Folder containing application components
│   ├── pages       # Folder containing application pages
│   ├── router      # Vue Router configuration
│   ├── stores      # Pinia configuration
│   ├── App.vue     # Root component file
│   ├── main.js     # Main entry point file
├── package.json    # npm configuration file

```

## Deployment
Build for production environment:
```
npm run build
```
## Contributing
If you would like to contribute to the project, please create a Pull Request or open a new Issue on GitHub.

## Contact
If you have any questions or feedback about the project, please contact via email: thanhlich2103gg@gmail.com
