import { useState } from 'react';
import { IconDownload, IconPlayerPlay, IconLoader2 } from '@tabler/icons-react';

export default function URLInput({ onFetchFormats, isLoading }) {
    const [url, setUrl] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (url.trim()) {
            onFetchFormats(url.trim());
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="glass-card p-7">
                {/* =============== brand header ================ */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <IconDownload className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold gradient-text">Pullbox</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="url" className="label-text block mb-2">
                            Media URL
                        </label>
                        <input
                            id="url"
                            type="search"
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-4 py-3.5 glass-inner rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all text-gray-800 placeholder:text-slate-500"
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!url.trim() || isLoading}
                        className="w-full btn-primary disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                    >
                        {isLoading ? (
                            <IconLoader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <IconPlayerPlay className="w-5 h-5" />
                        )}
                        {isLoading ? 'Fetching video information...' : 'Fetch Video Info'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-xs text-indigo-500/70">Supports YouTube, Facebook, X.com, Instagram, TikTok & thousands more</p>
                </div>
            </div>
        </div>
    );
}
