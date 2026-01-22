import { IconDownload, IconCheck, IconAlertCircle } from '@tabler/icons-react';

export default function DownloadProgress({ progress, status, error }) {
    if (status === 'idle') return null;

    return (
        <div className="w-full max-w-4xl mx-auto mt-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* =============== status header ================ */}
                <div className="flex items-center gap-3 mb-4">
                    {status === 'downloading' && (
                        <>
                            <IconDownload className="w-6 h-6 text-blue-600 animate-bounce" />
                            <h3 className="text-lg font-semibold text-gray-800">Downloading...</h3>
                        </>
                    )}
                    {status === 'completed' && (
                        <>
                            <IconCheck className="w-6 h-6 text-green-600" />
                            <h3 className="text-lg font-semibold text-green-800">Download completed!</h3>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <IconAlertCircle className="w-6 h-6 text-red-600" />
                            <h3 className="text-lg font-semibold text-red-800">Download failed</h3>
                        </>
                    )}
                </div>

                {/* =============== error message ================ */}
                {error && status === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* =============== progress information ================ */}
                {(status === 'downloading' || status === 'completed') && progress && (
                    <div className="space-y-4">
                        {/* =============== playlist progress ================ */}
                        {progress.playlistIndex && progress.playlistTotal && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <p className="text-sm font-semibold text-purple-800">
                                    Downloading video {progress.playlistIndex} of {progress.playlistTotal}
                                </p>
                                <div className="mt-2">
                                    <div className="w-full bg-purple-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(progress.playlistIndex / progress.playlistTotal) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* =============== filename ================ */}
                        {progress.filename && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">File:</p>
                                <p className="text-sm font-mono text-gray-800 truncate">
                                    {progress.filename}
                                </p>
                            </div>
                        )}

                        {/* =============== progress bar ================ */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                <span className="text-sm font-bold text-blue-600">
                                    {progress.percentage?.toFixed(1) || 0}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-linear-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress.percentage || 0}%` }}
                                />
                            </div>
                        </div>

                        {/* =============== speed and eta ================ */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-600 mb-1">Speed</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {progress.speed || 'calculating...'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 mb-1">Estimated time</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {progress.eta || 'calculating...'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* =============== completion message ================ */}
                {status === 'completed' && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-800">
                            Your download has been saved to the selected folder
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
