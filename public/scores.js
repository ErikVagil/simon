async function loadScoresFromCookies()
{
    let scores = [];
    try
    {
        const response = await fetch("/api/scores");
        scores = await response.json();

        // Update scores in cookies now in case server goes offline
        localStorage.setItem("scores", JSON.stringify(scores));
    }
    catch
    {
        // Use stored scores if the server went offline
        const storedScores = localStorage.getItem('scores');
        if (storedScores)
        {
            scores = JSON.parse(storedScores);
        }
    }

    const tableBodyElement = document.querySelector('#scores');

    if (scores.length)
    {
        for (const [i, score] of scores.entries())
        {
            const positionTdElement = document.createElement('td');
            const nameTdElement = document.createElement('td');
            const scoreTdElement = document.createElement('td');
            const dateTdElement = document.createElement('td');

            positionTdElement.textContent = i + 1;
            nameTdElement.textContent = score.name;
            scoreTdElement.textContent = score.score;
            dateTdElement.textContent = score.date;

            const rowElement = document.createElement('tr');
            rowElement.appendChild(positionTdElement);
            rowElement.appendChild(nameTdElement);
            rowElement.appendChild(scoreTdElement);
            rowElement.appendChild(dateTdElement);

            tableBodyElement.appendChild(rowElement);
        }
    }
    else
    {
        tableBodyElement.innerHTML = '<tr><td colSpan=4>Be the first to score</td></tr>';
    }
}

loadScoresFromCookies();