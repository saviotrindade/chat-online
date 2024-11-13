function changeNameColor() {
    const colorPalette = [
        'yellow',
        'orange',
        'brown',
        'red',
        'light-pink',
        'pink',
        'purple',
        'blue',
        'green',
    ];

    const otherUsers = document.getElementsByClassName("message-sender");

    Array.from(otherUsers).forEach((e) => {
        const color = Math.floor(Math.random() * colorPalette.length);

        e.classList.add(colorPalette[color]);
    });

}

changeNameColor();