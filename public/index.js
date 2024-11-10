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

    const otherUsers = document.getElementsByClassName("other-user-name");

    Array.from(otherUsers).forEach((e) => {
        const color = Math.floor(Math.random() * colorPalette.length);

        e.classList.add(colorPalette[color]);
    });

}

changeNameColor();