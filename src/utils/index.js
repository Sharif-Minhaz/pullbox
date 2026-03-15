export const parseYtDlpError = (errorMessage) => {
    let friendlyError = errorMessage;

    if (errorMessage.includes('Failed to resolve') || errorMessage.includes('Name or service not known')) {
        friendlyError = 'unable to access the URL. please check your internet connection or verify the URL is correct.';
    } else if (errorMessage.includes('Video unavailable') || errorMessage.includes('Video not available')) {
        friendlyError = 'video is unavailable or has been removed.';
    } else if (errorMessage.includes('Private video')) {
        friendlyError = 'this video is private and cannot be downloaded.';
    } else if (errorMessage.includes('Sign in to confirm')) {
        friendlyError = 'this content requires authentication. it cannot be downloaded.';
    } else if (errorMessage.includes('This video is not available')) {
        friendlyError = 'this video does not exist or is not available in your region.';
    } else if (errorMessage.includes('Unsupported URL')) {
        friendlyError = 'this URL is not supported. please try a different link.';
    } else if (errorMessage.toLowerCase().includes('http')) {
        friendlyError = 'network error. please check your internet connection and try again.';
    }

    return friendlyError;
};