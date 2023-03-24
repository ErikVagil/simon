function getImage()
{
    const zeroToThousand = Math.floor(Math.random() * 1000);
    fetch(`https://picsum.photos/v2/list?page=${zeroToThousand}&limit=1`)
    .then((response) => response.json())
    .then((data) =>
    {
        const frameElement = document.querySelector("#image-frame");

        const frameWidth = frameElement.offsetWidth;
        const frameHeight = frameElement.offsetHeight;

        const imageUrl = `https://picsum.photos/id/${data[0].id}/${frameWidth}/${frameHeight}?grayscale`;
        const imageElement = document.createElement("img");
        imageElement.setAttribute("src", imageUrl);
        frameElement.appendChild(imageElement);
    });
}

getImage();