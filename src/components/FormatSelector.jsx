import { IconVideo, IconMusic, IconFileTypeJpg } from '@tabler/icons-react';

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
        <div className="w-full max-w-4xl mx-auto mt-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* =============== media info header ================ */}
                <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white">
                    <div className="flex gap-4">
                        {thumbnail && (
                            <img 
                                src={thumbnail} 
                                alt={title}
                                className="w-40 h-24 object-cover rounded-lg shadow-lg"
                            />
                        )}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-2">{title}</h2>
                            {duration > 0 && (
                                <p className="text-blue-100">duration: {formatDuration(duration)}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* =============== format selection tabs ================ */}
                <div className="p-6">
                    <div className="space-y-6">
                        {/* =============== video formats ================ */}
                        {resolutionFormats.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <IconVideo className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-800">Video quality</h3>
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
                                            className={`p-4 border-2 rounded-lg transition-all ${
                                                selectedFormat?.formatId === format.formatId
                                                    ? 'border-blue-600 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <div className="text-center">
                                                <p className="font-bold text-lg text-gray-800">
                                                    {format.height}p
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {format.ext} • {formatFilesize(format.filesize)}
                                                </p>
                                                {format.fps && (
                                                    <p className="text-xs text-gray-500 mt-1">
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
                                    <IconMusic className="w-5 h-5 text-green-600" />
                                    <h3 className="text-lg font-semibold text-gray-800">Audio only</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <button
                                        onClick={() => onFormatChange({
                                            formatId: null,
                                            type: 'audio',
                                            ext: 'mp3',
                                        })}
                                        className={`p-4 border-2 rounded-lg transition-all ${
                                            selectedFormat?.type === 'audio'
                                                ? 'border-green-600 bg-green-50'
                                                : 'border-gray-200 hover:border-green-300'
                                        }`}
                                    >
                                        <div className="text-center">
                                            <p className="font-bold text-lg text-gray-800">
                                                best audio
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
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
