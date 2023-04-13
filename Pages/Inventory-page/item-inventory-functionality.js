
const buttonToEnterMainPage = document.getElementById("returnToMainPageButton");

buttonToEnterMainPage.onclick = () => { 
    window.functions.SiteNav.entryToMainPage();
}

window.functions.dataReceive.requestAndWaitForInventory();

