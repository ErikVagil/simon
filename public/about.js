function getImage()
{
    const random1000 = Math.floor(Math.random() * 1000);
    fetch(`https://picsum.photos/v2/list?page=${random1000}&limit=1`)
    .then((response) => 
    {
        response.json()
    })
    .then((data) =>
    {
        const frameElement = document.getElementById("picture");
        const frameWidth = frameElement.offsetWidth;
        const frameHeight = frameElement.offsetHeight;

        const url = `https://picsum.photos/id/${data[0].id}/${frameWidth}/${frameHeight}?grayscale`;
        const imgElement = document.createElement("img");
        imgElement.setAttribute("src", url);
        frameElement.appendChild(imgElement);
    });
}

function getQuote()
{
    fetch(`https://api.quotable.io/random`)
    .then((response) =>
    {
        response.json();
    })
    .then((data) =>
    {
        const plaqueElement = document.getElementById("quote");

        const quoteElement = document.createElement("p");
        quoteElement.textContent = data.content;
        quoteElement.classList.add("quote");

        const authorElement = document.createElement("p");
        authorElement.textContent = data.author;
        authorElement.classList.add("author");

        plaqueElement.appendChild(quoteElement);
        plaqueElement.appendChild(authorElement);
    });
}

getImage();
getQuote();