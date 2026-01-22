import { IconFolder, IconFolderOpen } from '@tabler/icons-react';

export default function OutputPathSelector({ outputPath, onSelectPath }) {
    const handleSelectFolder = async () => {
        const path = await window.electronAPI.selectFolder();
        if (path) {
            onSelectPath(path);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                output folder
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={outputPath || 'no folder selected'}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
                <button
                    onClick={handleSelectFolder}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                    {outputPath ? <IconFolderOpen className="w-5 h-5" /> : <IconFolder className="w-5 h-5" />}
                    browse
                </button>
            </div>
        </div>
    );
}
