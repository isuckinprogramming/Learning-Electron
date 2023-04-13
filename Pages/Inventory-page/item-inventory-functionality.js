
const buttonToEnterMainPage = document.getElementById("returnToMainPageButton");

buttonToEnterMainPage.onclick = () => { 
    window.SiteNavigation.entryToMainPage();
}

window.receiveInventoryData.requestAndWaitForInventory();

