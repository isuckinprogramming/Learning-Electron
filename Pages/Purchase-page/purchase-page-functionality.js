console.log("javascript file working")

const displayer = document.getElementById("displayer");
const buttonToEnterMainPage = document.getElementById("returnToMainPageButton");

buttonToEnterMainPage.onclick = window.SiteNavigation.entryToMainPage;

displayItemsToPurchase();

async function displayItemsToPurchase() { 

    let itemsToPurchase = await window.receiveInventoryData.requestAndWaitForInventory();
    
    displayer.innerText = "";

    for (let i = 0; i < itemsToPurchase.length; i++ ) { 
        
        displayItem(itemsToPurchase[ i ])
    }

    async function displayItem( item ) {
        let itemData =
            ` name: ${item.name} 
              price: ${item.price}
              quantity: ${item.quantity}
            `
        displayer.innerText += itemData;
    }

}

