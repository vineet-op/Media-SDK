//Photo type

export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: PhotoSrc;
  liked: boolean;
  alt: string;
}

export interface PhotoSrc {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

//video type

export interface Video {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  full_res: string | null;
  tags: string[];
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
}

export interface VideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number | null;
  height: number | null;
  fps?: number;
  link: string;
}

export interface VideoPicture {
  id: number;
  picture: string;
  nr: number;
}

// --- API response wrappers ---

export interface PhotosResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: Photo[];
  next_page?: string;
}

export interface VideosResponse {
  total_results: number;
  page: number;
  per_page: number;
  url: string;
  videos: Video[];
  next_page?: string;
}

// --- SDK config & events ---

export interface SDKConfig {
  apiKey: string;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export type SDKEventMap = {
  view: { id: number; type: "photo" | "video" };
  download: { id: number; type: "photo" | "video"; url: string };
};
