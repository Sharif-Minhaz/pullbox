import { useState, useEffect } from 'react';
import URLInput from './components/URLInput';
import FormatSelector from './components/FormatSelector';
import OutputPathSelector from './components/OutputPathSelector';
import DownloadOptions from './components/DownloadOptions';
import DownloadProgress from './components/DownloadProgress';
import PlaylistInfo from './components/PlaylistInfo';
import { IconDownload, IconRefresh } from '@tabler/icons-react';
import './App.css';
import { parseYtDlpError } from './utils';

function App() {
    const [currentUrl, setCurrentUrl] = useState('');
    const [isLoadingFormats, setIsLoadingFormats] = useState(false);
    const [mediaInfo, setMediaInfo] = useState(null);
    const [playlistInfo, setPlaylistInfo] = useState(null);
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [outputPath, setOutputPath] = useState(null);
    const [downloadOptions, setDownloadOptions] = useState({
        includeSubtitles: false,
        includeMetadata: true,
        downloadPlaylist: false,
    });
    const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, downloading, completed, error
    const [downloadProgress, setDownloadProgress] = useState(null);
    const [error, setError] = useState(null);

    // =============== load saved download path on mount ================
    useEffect(() => {
        const savedPath = localStorage.getItem('lastDownloadPath');
        if (savedPath) {
            setOutputPath(savedPath);
        }
    }, []);

    // =============== fetch available formats when user provides url ================
    const handleFetchFormats = async (url) => {
        setIsLoadingFormats(true);
        setError(null);
        setMediaInfo(null);
        setPlaylistInfo(null);
        setSelectedFormat(null);
        setDownloadStatus('idle');
        setCurrentUrl(url);

        try {
            // =============== first check if url is a playlist ================
            const playlistCheck = await window.electronAPI.checkPlaylist(url);
            setPlaylistInfo(playlistCheck);

            // =============== if playlist, auto-enable download playlist option ================
            if (playlistCheck.isPlaylist) {
                setDownloadOptions(prev => ({
                    ...prev,
                    downloadPlaylist: true,
                }));
            }

            // =============== fetch formats for the first video ================
            const info = await window.electronAPI.fetchFormats(url);
            setMediaInfo(info);
            
            // =============== auto-select best video format if available ================
            if (info.formats && info.formats.length > 0) {
                const videoFormats = info.formats.filter(format => 
                    format.vcodec && format.vcodec !== 'none'
                );
                if (videoFormats.length > 0) {
                    const bestVideo = videoFormats[0];
                    setSelectedFormat({
                        formatId: bestVideo.formatId,
                        type: 'video',
                        resolution: bestVideo.height,
                        ext: bestVideo.ext,
                    });
                }
            }
        } catch (error) {
            const friendlyError = parseYtDlpError(error.message);
            setError(friendlyError);
        } finally {
            setIsLoadingFormats(false);
        }
    };

    // =============== start download with selected options ================
    const handleStartDownload = async () => {
        if (!selectedFormat || !outputPath) {
            setError('please select a format and output folder');
            return;
        }

        setDownloadStatus('downloading');
        setDownloadProgress(null);
        setError(null);

        try {
            const result = await window.electronAPI.download({
                url: currentUrl,
                outputPath: outputPath,
                formatId: selectedFormat.formatId,
                audioOnly: selectedFormat.type === 'audio',
                includeSubtitles: downloadOptions.includeSubtitles,
                includeMetadata: downloadOptions.includeMetadata,
                downloadPlaylist: downloadOptions.downloadPlaylist,
                outputTemplate: '%(title)s.%(ext)s',
            });

            if (result.success) {
                setDownloadStatus('completed');
            }
        } catch (error) {
            console.error('Download error:', error);
            const friendlyError = parseYtDlpError(error.message);
            setDownloadStatus('error');
            setError(friendlyError);
        }
    };

    // =============== listen for progress updates ================
    useEffect(() => {
        const unsubscribeProgress = window.electronAPI.onProgress((progress) => {
            setDownloadProgress(progress);
            
            // =============== check if download is complete ================
            if (progress.percentage === 100) {
                setTimeout(() => {
                    setDownloadStatus('completed');
                }, 500);
            }
        });

        const unsubscribeError = window.electronAPI.onError((errorMessage) => {
            setError(errorMessage);
            setDownloadStatus('error');
        });

        return () => {
            unsubscribeProgress();
            unsubscribeError();
        };
    }, []);

    // =============== reset to start new download ================
    const handleReset = () => {
        setCurrentUrl('');
        setMediaInfo(null);
        setPlaylistInfo(null);
        setSelectedFormat(null);
        setDownloadStatus('idle');
        setDownloadProgress(null);
        setError(null);
    };

    // =============== handle playlist download toggle ================
    const handleTogglePlaylist = (enabled) => {
        setDownloadOptions(prev => ({
            ...prev,
            downloadPlaylist: enabled,
        }));
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* =============== url input section ================ */}
                <URLInput 
                    onFetchFormats={handleFetchFormats}
                    isLoading={isLoadingFormats}
                />

                {/* =============== error display ================ */}
                {error && (
                    <div className="w-full max-w-4xl mx-auto mt-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                {/* =============== playlist info ================ */}
                {playlistInfo && playlistInfo.isPlaylist && (
                    <PlaylistInfo 
                        playlistInfo={playlistInfo}
                        onTogglePlaylist={handleTogglePlaylist}
                        downloadPlaylist={downloadOptions.downloadPlaylist}
                    />
                )}

                {/* =============== format selector ================ */}
                {mediaInfo && (
                    <>
                        <FormatSelector 
                            mediaInfo={mediaInfo}
                            selectedFormat={selectedFormat}
                            onFormatChange={setSelectedFormat}
                        />

                        {/* =============== output path selector ================ */}
                        <div className="w-full max-w-4xl mx-auto mt-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <OutputPathSelector 
                                    outputPath={outputPath}
                                    onSelectPath={setOutputPath}
                                />
                            </div>
                        </div>

                        {/* =============== download options ================ */}
                        <DownloadOptions 
                            options={downloadOptions}
                            onOptionsChange={setDownloadOptions}
                        />

                        {/* =============== download button ================ */}
                        <div className="w-full max-w-4xl mx-auto mt-6">
                            <div className="flex gap-3">
                                <button
                                    onClick={handleStartDownload}
                                    disabled={!selectedFormat || !outputPath || downloadStatus === 'downloading'}
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors text-lg"
                                >
                                    <IconDownload className="w-6 h-6" />
                                    {downloadStatus === 'downloading' ? 'Downloading...' : 'Start Download'}
                                </button>
                                
                                {(downloadStatus === 'completed' || downloadStatus === 'error') && (
                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <IconRefresh className="w-6 h-6" />
                                        New Download
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* =============== download progress ================ */}
                <DownloadProgress 
                    progress={downloadProgress}
                    status={downloadStatus}
                    error={downloadStatus === 'error' ? error : null}
                />
            </div>
        </div>
    );
}

export default App;
