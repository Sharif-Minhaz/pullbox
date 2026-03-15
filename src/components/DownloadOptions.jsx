import { IconSubtitles, IconInfoCircle, IconPlaylist, IconCheck } from '@tabler/icons-react';

export default function DownloadOptions({ options, onOptionsChange }) {
    const handleToggle = (option) => {
        onOptionsChange({
            ...options,
            [option]: !options[option],
        });
    };

    const optionItems = [
        {
            key: 'includeSubtitles',
            icon: IconSubtitles,
            label: 'Include Subtitles',
            description: 'Download available subtitles',
        },
        {
            key: 'includeMetadata',
            icon: IconInfoCircle,
            label: 'Embed Metadata',
            description: 'Include title, artist, thumbnail',
        },
        {
            key: 'downloadPlaylist',
            icon: IconPlaylist,
            label: 'Download Entire Playlist',
            description: 'If URL is a playlist, download all videos',
        },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto mt-5">
            <div className="glass-card p-6">
                <h3 className="label-text mb-4">Download Options</h3>

                <div className="space-y-3">
                    {optionItems.map(({ key, icon: Icon, label, description }) => {
                        const isChecked = options[key];
                        return (
                            <label
                                key={key}
                                className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200 ${
                                    isChecked
                                        ? 'glass-inner-selected'
                                        : 'glass-inner hover:border-indigo-300'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggle(key)}
                                    className="sr-only"
                                />
                                <div className={`custom-checkbox ${isChecked ? 'checked' : ''}`}>
                                    {isChecked && <IconCheck className="w-3.5 h-3.5" />}
                                </div>
                                <Icon className="w-5 h-5 text-indigo-400" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-indigo-950">{label}</p>
                                    <p className="text-xs text-slate-600">{description}</p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
