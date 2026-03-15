import { IconSubtitles, IconInfoCircle, IconPlaylist } from '@tabler/icons-react';

export default function DownloadOptions({ options, onOptionsChange }) {
    const handleToggle = (option) => {
        onOptionsChange({
            ...options,
            [option]: !options[option],
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Download options</h3>
                
                <div className="space-y-3">
                    {/* =============== subtitles option ================ */}
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            checked={options.includeSubtitles}
                            onChange={() => handleToggle('includeSubtitles')}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <IconSubtitles className="w-5 h-5 text-gray-600" />
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">Include subtitles</p>
                            <p className="text-xs text-gray-500">Download available subtitles</p>
                        </div>
                    </label>

                    {/* =============== metadata option ================ */}
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            checked={options.includeMetadata}
                            onChange={() => handleToggle('includeMetadata')}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <IconInfoCircle className="w-5 h-5 text-gray-600" />
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">Embed metadata</p>
                            <p className="text-xs text-gray-500">Include title, artist, thumbnail</p>
                        </div>
                    </label>

                    {/* =============== playlist option ================ */}
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            checked={options.downloadPlaylist}
                            onChange={() => handleToggle('downloadPlaylist')}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <IconPlaylist className="w-5 h-5 text-gray-600" />
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">Download entire playlist</p>
                            <p className="text-xs text-gray-500">If URL is a playlist, download all videos</p>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
}
