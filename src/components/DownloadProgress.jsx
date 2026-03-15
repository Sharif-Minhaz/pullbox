import { IconDownload, IconCheck, IconAlertCircle, IconLoader2 } from '@tabler/icons-react';

export default function DownloadProgress({ progress, status, error }) {
    if (status === 'idle') return null;

    // =============== normalize filename to show actual output format ================
    const getDisplayFilename = (filename) => {
        if (!filename) return '';
        // =============== replace video extensions with mp4 since we merge to mp4 ================
        return filename.replace(/\.(webm|mkv|flv|avi)$/i, '.mp4');
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-5">
            <div
                className="glass-card p-6"
                style={
                    status === 'completed'
                        ? { borderColor: 'rgba(187, 247, 208, 0.6)' }
                        : status === 'error'
                            ? { borderColor: 'rgba(252, 165, 165, 0.4)' }
                            : undefined
                }
            >
                {/* =============== status header ================ */}
                <div className="flex items-center gap-3 mb-4">
                    {status === 'downloading' && (
                        <>
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
                                <IconLoader2 className="w-4.5 h-4.5 text-white animate-spin" />
                            </div>
                            <h3 className="text-lg font-bold text-indigo-950">Downloading...</h3>
                        </>
                    )}
                    {status === 'completed' && (
                        <>
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md shadow-green-500/20">
                                <IconCheck className="w-4.5 h-4.5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-green-800">Download Complete!</h3>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md shadow-red-500/20">
                                <IconAlertCircle className="w-4.5 h-4.5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-red-800">Download Failed</h3>
                        </>
                    )}
                </div>

                {/* =============== error message ================ */}
                {error && status === 'error' && (
                    <div className="bg-red-50/60 border border-red-200/50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* =============== progress information ================ */}
                {(status === 'downloading' || status === 'completed') && progress && (
                    <div className="space-y-4">
                        {/* =============== playlist progress ================ */}
                        {progress.playlistIndex && progress.playlistTotal && (
                            <div className="bg-violet-50/60 border border-violet-200/50 rounded-xl p-4">
                                <p className="text-sm font-bold text-violet-800">
                                    Downloading video {progress.playlistIndex} of {progress.playlistTotal}
                                </p>
                                <div className="mt-2">
                                    <div className="w-full bg-violet-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-linear-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(progress.playlistIndex / progress.playlistTotal) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* =============== filename ================ */}
                        {progress.filename && (
                            <div>
                                <p className="text-xs text-slate-600 mb-1">File:</p>
                                <p className="text-sm font-mono text-indigo-950 truncate">
                                    {getDisplayFilename(progress.filename)}
                                </p>
                            </div>
                        )}

                        {/* =============== progress bar ================ */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Progress</span>
                                <span className="text-sm font-extrabold text-indigo-500">
                                    {progress.percentage?.toFixed(1) || 0}%
                                </span>
                            </div>
                            <div className="w-full bg-indigo-100/60 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="progress-bar-fill h-2.5 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress.percentage || 0}%` }}
                                />
                            </div>
                        </div>

                        {/* =============== speed and eta ================ */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-indigo-50/40 rounded-xl p-3.5">
                                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Speed</p>
                                <p className="text-sm font-bold text-indigo-950 mt-0.5">
                                    {progress.speed || 'calculating...'}
                                </p>
                            </div>
                            <div className="bg-indigo-50/40 rounded-xl p-3.5">
                                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">Estimated Time</p>
                                <p className="text-sm font-bold text-indigo-950 mt-0.5">
                                    {progress.eta || 'calculating...'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* =============== completion message ================ */}
                {status === 'completed' && (
                    <div className="mt-4 bg-green-50/60 border border-green-200/50 rounded-xl p-4">
                        <p className="text-sm text-green-800 font-medium">
                            Your download has been saved to the selected folder
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
