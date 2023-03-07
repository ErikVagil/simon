const buttonAssets = [
    {soundfile: "assets/sound1.mp3", hue: 120},
    {soundfile: "assets/sound2.mp3", hue: 0},
    {soundfile: "assets/sound3.mp3", hue: 60},
    {soundfile: "assets/sound4.mp3", hue: 240}
];

class Button
{
    constructor(assetPair, element)
    {
        // Initialize object members
        this.element = element;
        this.soundfile = new Audio(assetPair.soundfile);
        this.hue = assetPair.hue;

        // Set button color
        this.paint(0.25);
    }

    // Change brightness value of button
    // 0.0 <= percentage <= 1.0
    paint(percentage)
    {
        // Set button brightness to percentage
        const color = `hsl(${this.hue}, 100%, ${percentage})`;

        // Set button style
        this.element.style.backgroundColor = color;
    }

    // Visual and audio effect on click
    async press(volume)
    {
        this.paint(0.50);
        await this.play(volume);
        this.paint(0.25);
    }

    // Create sound
    async play(volume = 1.0)
    {
        this.soundfile.volume = volume;

        // Promise meant to work around Safari needing permission for sound
        await new Promise((resolve) => 
        {
            this.soundfile.onended = resolve;
            this.soundfile.play();
        });
    }
}
