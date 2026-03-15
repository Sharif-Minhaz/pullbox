import { IconPlaylist, IconVideo, IconCheck } from '@tabler/icons-react';

export default function PlaylistInfo({ playlistInfo, onTogglePlaylist, downloadPlaylist }) {
    if (!playlistInfo || !playlistInfo.isPlaylist) return null;

    const { playlistTitle, playlistCount, entries } = playlistInfo;

    // =============== format duration ================
    const formatDuration = (seconds) => {
        if (!seconds) return 'N/A';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-5">
            <div className="bg-linear-to-r from-indigo-500 to-violet-600 rounded-[20px] shadow-lg shadow-indigo-500/15 p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <IconPlaylist className="w-8 h-8" />
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold">Playlist Detected</h2>
                        <p className="text-indigo-100 text-sm truncate">{playlistTitle}</p>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <IconVideo className="w-5 h-5" />
                            <span className="font-bold text-lg">{playlistCount} videos</span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={downloadPlaylist}
                                onChange={(event) => onTogglePlaylist(event.target.checked)}
                                className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                                downloadPlaylist
                                    ? 'bg-white border-white'
                                    : 'border-indigo-300 bg-transparent'
                            }`}>
                                {downloadPlaylist && <IconCheck className="w-3.5 h-3.5 text-indigo-600" />}
                            </div>
                            <span className="font-medium">Download all videos</span>
                        </label>
                    </div>
                </div>

                {/* =============== preview first few videos ================ */}
                {entries && entries.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm text-indigo-100 mb-2">Preview (first {entries.length} videos):</p>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 space-y-2 max-h-48 overflow-y-auto">
                            {entries.map((entry, index) => (
                                <div key={entry.id || index} className="flex items-start gap-2 text-sm">
                                    <span className="text-indigo-200 font-mono text-xs mt-0.5">{index + 1}.</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{entry.title}</p>
                                        {entry.duration > 0 && (
                                            <p className="text-indigo-200 text-xs">{formatDuration(entry.duration)}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {playlistCount > entries.length && (
                                <p className="text-indigo-200 text-xs italic">
                                    ... and {playlistCount - entries.length} more videos
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {!downloadPlaylist && (
                    <p className="text-indigo-100 text-sm mt-3">
                        Only the first video will be downloaded. Enable "Download all videos" to download the entire playlist.
                    </p>
                )}
            </div>
        </div>
    );
}
