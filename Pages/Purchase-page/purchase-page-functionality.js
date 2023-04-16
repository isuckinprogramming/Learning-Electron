console.log("javascript file working")

const displayer = document.getElementById("displayer");
const buttonToEnterMainPage = document.getElementById("returnToMainPageButton");
const buttonForPurchase = document.getElementById("purchaseButton");

buttonToEnterMainPage.onclick = window.SiteNavigation.entryToMainPage;
buttonForPurchase.onclick = purchase;

displayItemsToPurchase();

async function displayItemsToPurchase() { 

  let itemsToPurchase = await window.receiveInventoryData.requestAndWaitForInventory();
  displayer.innerText = "";

  // an enhanced for loop did not work because it would throw an error because the inventory is not iterable. 
  for (let i = 0; i < itemsToPurchase.length; i++ ) { 
      
    displayItem( itemsToPurchase[ i ] )
  } 

  async function displayItem( item ) {
    let itemData =
    ` name: ${item.name} 
      price: ${item.price}
      quantity: ${item.quantity} `
    
    displayer.innerText += itemData;
  }
}



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

async function purchase() {

  const resultFromNameCheck = await takeNameOfItemToPurchase();

  if ( ! resultFromNameCheck.doesNameExist ) { 
    /**
     *  end of purchase process because the item does not exist, so no need to go over the 
     *  other parts of the process. 
    */
    return;
  }

  const itemName = resultFromNameCheck.nameOfItemEntered;
  
  const resultFromQuantityCheck = await takeQuantityOfItemToPurchase(itemName);

  if ( !resultFromQuantityCheck.isQuantityValid ) { 
    
    //end function because quantity entered is invalid
    return;
  }

  const resultFromMoneyTransaction = await takeMoneyForPuchase(
    resultFromQuantityCheck.pricePerPiece,
    resultFromQuantityCheck.quantityToPurchase  
  )




  async function isInputNotEmpty( input ) {   
    
    if (
      input === "" ||
      input.trim() === "" ||
      input === undefined ) {
      
      return false;
    }
    return true;
  }

  async function takeNameOfItemToPurchase() {     
    
    const nameTaker = document.getElementById("nameOfItemToPurchaseReceiver");
    const nameOfItem = nameTaker.value;  
    
    const isValueValid = await isInputNotEmpty(nameOfItem);

    if ( !isValueValid ) { 
      //end function, no need for verification
      console.log("user entered a value that cannot be identified to any item name inside inventory")
      return { doesNameExist: false, nameOfItemEntered: nameOfItem };
    }

    let result = await window.PurchaseItem.checkIfItemNameExist( nameOfItem )
    console.log(`feedback from main process received, ${result} `)
    return { doesNameExist: true, nameOfItemEntered: nameOfItem };
  }

  async function takeQuantityOfItemToPurchase( nameOfItem ) {
    
    const quantityTaker = document.getElementById("amountToPurchaseReceiver");
    const quantity = quantityTaker.value;

    if ( ! ( await isInputNotEmpty( quantity ) ) ) { 
      //invalid input
      return;
    }
      


  }

  async function takeMoneyForPuchase( pricePerPiece , quantity ) { 
  
    const moneyTaker = document.getElementById("purchaseMoneyReceiver");
    const money = moneyTaker.value;

    if (!( await isInputNotEmpty( money ))) { 
      // invalid input
      return;
    }



  }
}

