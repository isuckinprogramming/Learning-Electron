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

function purchase() {

  function takeNameOfItemToPurchase() { 
    
    const nameTaker = document.getElementById("nameOfItemToPurchaseReceiver");
    let nameOfItem = nameTaker.value;

    

    /*
    *send name of item to inventory for handling, 
    *and see if there is such an item that exist inside
    *wait for response,
    * if there is no item 
    *   then return a value representing representing a failed outcome
    *if outcome is successful 
    *   then accept the query for the item and proceed
    *to check if the amount the user wants to buy is valid
    *   must not be 0 or lower and must not be a decimal number and must not exceed the available quantity
    *if all conditions are clear 
    *  then take the price of the item and multiply it with the amount to purchase
    * take the amount of money the user has entered 
    * examine the validity of the input of the user, 
    *   must not be 0 or lower and the data type must be a number
    * diminish the money the user entered with the calculated price
    *   if the result is not a negative number then the user has succesfully purchased the item/items
    *     diminish the amount of the item inside of the inventory by the amount the user purchased
    *     tell user that the purchase is successful
    *  
    */
  }

  function takeQuantityOfItemToPurchase() {
      
  }

  function takeMoneyForPuchase() { 
   
  }
}