const form = document.getElementById('fs');
const input = document.getElementById('is');
if (form && input) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        await processUrl(input.value.trim(), '/1');
    });
}
function registerServiceWorker() {
    return window.navigator.serviceWorker.register('./sw.js', {
        scope: __uv$config.prefix,
    }).catch(error => {
        console.error('Service Worker registration failed:', error);
        alert('Failed to register service worker. Please try again.');
    });
}
async function processUrl(value, path) {
    await registerServiceWorker();
    let url = value;
    if (!isUrl(url)) {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        url = `https://${url}`;
    }
    sessionStorage.setItem('GoUrl', __uv$config.encodeUrl(url));
    if (path) {
        location.href = path;
    } else {
        window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    }
}
function redirectToUrl(value) {
    processUrl(value, '/1');
}
function processUrlWithoutPath(value) {
    processUrl(value);
}
function isUrl(val = '') {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\\.)+[a-z]{2,}|' +
        'localhost|' +
        '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' +
        '\\[?[a-f0-9]*:[a-f0-9:%.~+?&=]*\\])' +
        '(\\:\\d+)?(\\/[-a-z0-9+&@#/%=~_|$?!:.]*)*$', 'i');
    return urlPattern.test(val);
}
