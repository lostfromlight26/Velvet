export interface PlaylistSong {
  id: number;
  playlistId: number;
  youtubeId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
}

export interface Playlist {
  id: number;
  name: string;
  folderId: number;
  createdAt: string;
  songs: PlaylistSong[];
}
