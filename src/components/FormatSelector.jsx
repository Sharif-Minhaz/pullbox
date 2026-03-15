import { IconVideo, IconMusic } from '@tabler/icons-react';

export default function FormatSelector({ mediaInfo, selectedFormat, onFormatChange }) {
    if (!mediaInfo) return null;

    const { title, thumbnail, duration, resolutions, formats } = mediaInfo;

    // =============== filter formats by type ================
    const videoFormats = formats.filter(format => format.vcodec && format.vcodec !== 'none');
    const audioFormats = formats.filter(format =>
        format.acodec && format.acodec !== 'none' &&
        (!format.vcodec || format.vcodec === 'none')
    );

    // =============== get best format for each resolution ================
    const resolutionFormats = resolutions.map(resolution => {
        const formatsAtResolution = videoFormats.filter(format => format.height === resolution);
        // =============== prefer formats with both video and audio ================
        const withAudio = formatsAtResolution.find(format => format.acodec && format.acodec !== 'none');
        return withAudio || formatsAtResolution[0];
    }).filter(Boolean);

    // =============== format duration ================
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    };

    // =============== format filesize ================
    const formatFilesize = (bytes) => {
        if (!bytes) return 'unknown size';
        const mb = bytes / (1024 * 1024);
        if (mb > 1024) {
            return `${(mb / 1024).toFixed(2)} GB`;
        }
        return `${mb.toFixed(2)} MB`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-5">
            <div className="glass-card overflow-hidden">
                {/* =============== media info header ================ */}
                <div className="bg-linear-to-r from-indigo-500 to-violet-600 p-6 text-white">
                    <div className="flex gap-4">
                        {thumbnail && (
                            <img
                                src={thumbnail}
                                alt={title}
                                className="w-40 h-24 object-cover rounded-xl shadow-lg shadow-black/20"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold mb-2 leading-snug">{title}</h2>
                            {duration > 0 && (
                                <p className="text-indigo-100 text-sm">Duration: {formatDuration(duration)}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* =============== format selection ================ */}
                <div className="p-6">
                    <div className="space-y-6">
                        {/* =============== video formats ================ */}
                        {resolutionFormats.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <IconVideo className="w-5 h-5 text-indigo-500" />
                                    <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-wide">Video Quality</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {resolutionFormats.map((format) => (
                                        <button
                                            key={format.formatId}
                                            onClick={() => onFormatChange({
                                                formatId: format.formatId,
                                                type: 'video',
                                                resolution: format.height,
                                                ext: format.ext,
                                            })}
                                            className={`p-4 rounded-xl transition-all duration-200 ${
                                                selectedFormat?.formatId === format.formatId
                                                    ? 'glass-inner-selected'
                                                    : 'glass-inner hover:border-indigo-300'
                                            }`}
                                        >
                                            <div className="text-center">
                                                <p className="font-extrabold text-lg text-indigo-950">
                                                    {format.height}p
                                                </p>
                                                <p className="text-xs text-slate-600 mt-1">
                                                    {format.ext} · {formatFilesize(format.filesize)}
                                                </p>
                                                {format.fps && (
                                                    <p className="text-xs text-indigo-500/70 mt-1">
                                                        {format.fps} fps
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* =============== audio only ================ */}
                        {audioFormats.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <IconMusic className="w-5 h-5 text-violet-500" />
                                    <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-wide">Audio Only</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <button
                                        onClick={() => onFormatChange({
                                            formatId: null,
                                            type: 'audio',
                                            ext: 'mp3',
                                        })}
                                        className={`p-4 rounded-xl transition-all duration-200 ${
                                            selectedFormat?.type === 'audio'
                                                ? 'glass-inner-selected'
                                                : 'glass-inner hover:border-violet-300'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <p className="font-bold text-lg text-indigo-950">
                                                Best Audio
                                            </p>
                                            <p className="text-xs text-slate-600 mt-1">
                                                mp3 format
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
