// =============== typescript declarations for electron api exposed via preload ================

export interface FormatInfo {
    formatId: string;
    ext: string;
    resolution: string;
    filesize: number;
    vcodec: string;
    acodec: string;
    fps: number;
    height: number;
    width: number;
}

export interface MediaInfo {
    title: string;
    thumbnail: string | null;
    duration: number;
    formats: FormatInfo[];
    resolutions: number[];
    extensions: string[];
    hasAudio: boolean;
    hasVideo: boolean;
}

export interface PlaylistEntry {
    title: string;
    id: string;
    duration: number;
}

export interface PlaylistInfo {
    isPlaylist: boolean;
    playlistTitle?: string;
    playlistCount?: number;
    playlistId?: string | null;
    entries?: PlaylistEntry[];
}

export interface DownloadOptions {
    url: string;
    outputPath: string;
    formatId: string | null;
    audioOnly: boolean;
    includeSubtitles: boolean;
    includeMetadata: boolean;
    downloadPlaylist: boolean;
    outputTemplate: string;
}

export interface DownloadProgress {
    percentage: number;
    speed: string;
    eta: string;
    filename: string;
    playlistIndex?: number | null;
    playlistTotal?: number | null;
}

export interface DownloadResult {
    success: boolean;
    message: string;
}

export interface ElectronAPI {
    checkPlaylist: (url: string) => Promise<PlaylistInfo>;
    fetchFormats: (url: string) => Promise<MediaInfo>;
    download: (options: DownloadOptions) => Promise<DownloadResult>;
    selectFolder: () => Promise<string | null>;
    onProgress: (callback: (progress: DownloadProgress) => void) => () => void;
    onError: (callback: (error: string) => void) => () => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}

export {};
