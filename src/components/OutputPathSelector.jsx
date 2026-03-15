import { IconFolder, IconFolderOpen } from '@tabler/icons-react';

export default function OutputPathSelector({ outputPath, onSelectPath }) {
    const handleSelectFolder = async () => {
        const path = await window.electronAPI.selectFolder();
        if (path) {
            localStorage.setItem('lastDownloadPath', path);
            onSelectPath(path);
        }
    };

    return (
        <div className="space-y-2">
            <label className="label-text block">
                Output Folder
            </label>
            <div className="flex gap-3">
                <input
                    type="text"
                    value={outputPath || 'No folder selected'}
                    readOnly
                    className="flex-1 px-4 py-3 glass-inner rounded-xl text-slate-700 text-sm"
                />
                <button
                    onClick={handleSelectFolder}
                    className="px-5 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 font-semibold text-sm text-indigo-500 border-1.5 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 hover:border-indigo-300"
                >
                    {outputPath ? <IconFolderOpen className="w-5 h-5" /> : <IconFolder className="w-5 h-5" />}
                    Browse
                </button>
            </div>
        </div>
    );
}
