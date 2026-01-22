import { useState } from 'react';
import { IconDownload, IconPlayerPlay } from '@tabler/icons-react';

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
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-4">
                    <IconDownload className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Pullbox</h1>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                            Media URL
                        </label>
                        <input
                            id="url"
                            type="search"
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!url.trim() || isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <IconPlayerPlay className="w-5 h-5" />
                        {isLoading ? 'fetching video information...' : 'fetch video information'}
                    </button>
                </form>

                <div className="mt-4 text-xs text-gray-500">
                    <p>Supported sites: YouTube, Facebook, X.com, Instagram, TikTok, and thousands more</p>
                </div>
            </div>
        </div>
    );
}
