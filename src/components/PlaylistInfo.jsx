import { IconPlaylist, IconVideo } from '@tabler/icons-react';

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
        <div className="w-full max-w-4xl mx-auto mt-6">
            <div className="bg-linear-to-r from-purple-600 to-purple-700 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                    <IconPlaylist className="w-8 h-8" />
                    <div className="flex-1">
                        <h2 className="text-xl font-bold">playlist detected</h2>
                        <p className="text-purple-100 text-sm">{playlistTitle}</p>
                    </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <IconVideo className="w-5 h-5" />
                            <span className="font-semibold text-lg">{playlistCount} videos</span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={downloadPlaylist}
                                onChange={(event) => onTogglePlaylist(event.target.checked)}
                                className="w-5 h-5 rounded text-purple-600 focus:ring-2 focus:ring-white"
                            />
                            <span className="font-medium">download all videos</span>
                        </label>
                    </div>
                </div>

                {/* =============== preview first few videos ================ */}
                {entries && entries.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm text-purple-100 mb-2">preview (first {entries.length} videos):</p>
                        <div className="bg-white/10 rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                            {entries.map((entry, index) => (
                                <div key={entry.id || index} className="flex items-start gap-2 text-sm">
                                    <span className="text-purple-200 font-mono">{index + 1}.</span>
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{entry.title}</p>
                                        {entry.duration > 0 && (
                                            <p className="text-purple-200 text-xs">{formatDuration(entry.duration)}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {playlistCount > entries.length && (
                                <p className="text-purple-200 text-xs italic">
                                    ... and {playlistCount - entries.length} more videos
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {!downloadPlaylist && (
                    <p className="text-purple-100 text-sm mt-3">
                        ℹ️ only the first video will be downloaded. enable "download all videos" to download the entire playlist.
                    </p>
                )}
            </div>
        </div>
    );
}
