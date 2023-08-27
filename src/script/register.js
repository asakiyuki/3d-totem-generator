if ('serviceWorker' in navigator && !navigator.isStandalone) {
    document.getElementById('installButton').style.display = 'block';
    document.getElementById('installButton').addEventListener('click', () => {
        navigator.serviceWorker.register('./sw.js');
    })
}