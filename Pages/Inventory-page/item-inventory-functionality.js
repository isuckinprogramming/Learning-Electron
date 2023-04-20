
const buttonToEnterMainPage = document.getElementById("returnToMainPageButton");
const inventoryContentsDisplayer = document.getElementById("itemDisplayer");

buttonToEnterMainPage.onclick = window.SiteNavigation.entryToMainPage;


fetchInventoryAndDisplayContents();

async function fetchInventoryAndDisplayContents() { 

  //inventoryData is an array of item, and an item contains fields such as name, price, quantity. 
  let inventoryData = await window.receiveInventoryData.requestAndWaitForInventory();

  if (inventoryData.size === 0) { 
    console.log("No items to display")
    return;
  }
  
  displayInventoryToPage( inventoryData )
  
  // console.log(
  //   `Data From Inventory : ${inventoryData[0].name} , ${inventoryData[0].price} , ${inventoryData[0].quantity} `
  // )
}

async function displayInventoryToPage( inventory ) {
  
  if (inventory.length === 0) { 
    //no items to display so terminate the function
    inventoryContentsDisplayer.innerHTML += "no items to display"
    return;
  }

  for (let itemInside of inventory.values()) { 
    displayItemToPage(itemInside);
  }
}

async function displayItemToPage( itemToDisplay ) { 

  inventoryContentsDisplayer.innerHTML += `<li>name : ${itemToDisplay.name} , price : ${itemToDisplay.price} , quantity : ${itemToDisplay.quantity} </li>`;
}