function login()
{
    // Gets the username input text field
    const usernameTextBox = document.querySelector("user");

    // Sets the item "inputtedUserName" in cookies to the value in usernameTextBox
    localStorage.setItem("inputtedUserName", usernameTextBox.value);

    // Sets the current page to play.html
    window.location.href = "play.html";
}