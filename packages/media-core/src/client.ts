import { EventEmitter } from "./emitter";
import { Cache } from "./cache";
import type {
  Photo,
  PhotosResponse,
  Video,
  VideosResponse,
  SDKConfig,
  PaginationParams,
  SDKEventMap,
} from "./types";

export class PexelsClient {
  private readonly apiKey: string;
  private readonly photoCache = new Cache<PhotosResponse>();
  private readonly videoCache = new Cache<VideosResponse>();
  private readonly singlePhotoCache = new Cache<Photo>();
  private readonly singleVideoCache = new Cache<Video>();
  readonly events = new EventEmitter<SDKEventMap>();

  constructor(config: SDKConfig) {
    if (!config.apiKey) throw new Error("media-core: apiKey is required");
    this.apiKey = config.apiKey;
    // default listener — logs every event so the app author can see activity
    this.events.on("view", (e) => console.log("[media-core] view", e));
    this.events.on("download", (e) => console.log("[media-core] download", e));
  }

  private async request<T>(url: string, cache: Cache<T>): Promise<T> {
    return cache.getOrFetch(url, async () => {
      const res = await fetch(url, {
        headers: {
          Authorization: this.apiKey,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`);
      }
      const data = (await res.json()) as T;
      return data;
    });
  }

  //Public Photos API methods

  async searchPhotos(
    query: string,
    params: PaginationParams = {},
  ): Promise<PhotosResponse> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 20;
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
    return this.request(url, this.photoCache);
  }

  async getCuratedPhotos(
    params: PaginationParams = {},
  ): Promise<PhotosResponse> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 20;
    const url = `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;
    return this.request(url, this.photoCache);
  }

  async getPhoto(id: number): Promise<Photo> {
    const url = `https://api.pexels.com/v1/photos/${id}`;
    const photo = await this.request(url, this.singlePhotoCache);
    this.events.emit("view", { id, type: "photo" });
    return photo;
  }

  // Public Video API methods

  async searchVideos(
    query: string,
    params: PaginationParams = {},
  ): Promise<VideosResponse> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 20;
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
    return this.request(url, this.videoCache);
  }

  async getVideo(id: number): Promise<Video> {
    const url = `https://api.pexels.com/videos/videos/${id}`;
    const video = await this.request(url, this.singleVideoCache);
    this.events.emit("view", { id, type: "video" });
    return video;
  }

  trackDownload(id: number, type: 'photo' | 'video', url: string): void {
    this.events.emit('download', { id, type, url });
  }

  clearCache(): void {
    this.photoCache.clear();
    this.videoCache.clear();
    this.singlePhotoCache.clear();
    this.singleVideoCache.clear();
  }
}
