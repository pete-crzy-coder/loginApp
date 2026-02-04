(function randomTitleCaps() {
    let original = document.title.split('');
    setInterval(() => {
        let title = original.map(char => Math.random() < 0.3 ? char.toUpperCase() : char.toLowerCase());
        document.title = title.join('');
    }, Math.random() * 1000 + 20); // random interval between 20ms and 1020ms
})();
