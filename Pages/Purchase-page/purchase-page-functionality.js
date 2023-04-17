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

  purchaseProcess();

  async function purchaseProcess() {

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
    
    /**
     * 
     * If all three purchase sub process is succesful then the next process would be recording
     * the purchase and passing it to a new 
    */
    

   }

  async function isInputEmpty( input ) {   
    
    if (
      input === "" ||
      input.trim() === "" ||
      input === undefined ) {
      
      return true;
    }
    return false;
  }

  async function takeNameOfItemToPurchase() {     
    
    const nameTaker = document.getElementById("nameOfItemToPurchaseReceiver");
    const nameOfItem = nameTaker.value;  
    
    if ( await isInputEmpty( nameOfItem ) ) { 
      //end function, no need for verification
    
      console.log("user entered a value that cannot be identified to any item name inside inventory")
    
      return { doesNameExist: false, nameOfItemEntered: nameOfItem };
    }

    let result = await window.PurchaseItem.checkIfItemNameExist( nameOfItem )
    console.log(`feedback from main process received, ${result} `)
    
    return { doesNameExist: true, nameOfItemEntered: nameOfItem };
  }

  /**
   * 
   * check if input is valid, if not then send a signal that it is not valid and end function
   * 
   * the invalid inputs are values of number that are lower than 0 and equal to 0, and any other data
   * type that is not a number. 
   * 
   * send request to the main process for item details, quantity and price per piece
   * 
   * if the quantity is lower than the requested amount, reject the purchase and end 
   * the function
   * 
   * then if the quantity is equal to or higher than the requested amount then the purchase is 
   * valid
   * 
   * return the price per piece and the amount to be purchased, as well as a signal for the 
   * validity of the quantity to be purchased,
   * 
  */
  async function takeQuantityOfItemToPurchase( nameOfItem ) {
    
    const quantityTaker = document.getElementById("amountToPurchaseReceiver");
    let quantity = quantityTaker.value;

    //check if the user actually entered something.
    if ( await isInputEmpty( quantity ) ) { 
      //invalid input
      return { isQuantityValid: false };
    }
    
    const quantityNumberFormat = +quantity;
    
    /*  check if the number is an integer, 
    * really necessary to be an integer, 
    * not a floating point number 
    */
    if (!Number.isInteger(quantityNumberFormat)) { 

      console.log("The user did not enter a number and cannot proceed with purchase process")
      return { isQuantityValid: false };
    }

    const resultFromAvailabilityCheck = await checkIfQuantityToPurchaseIsAvailable(nameOfItem, quantity);
    
    /*
    *if the amount the user entered is greater than what is available then the process cannot continue 
    */
    if (!resultFromAvailabilityCheck.isItemAvailable) { 

      console.log("quantity is greater than the available amount of the item.")
      return {isQuantityValid: false};
    }

    return {
      isQuantityValid: true,
      quantityToPurchase: quantityNumberFormat,
      pricePerPiece: resultFromAvailabilityCheck.pricePerPiece
    }
  }

  /**
   * Take the value for the money
   * 
   * check validity, check if the value is not empty 
   *  if not valid then end the functions
   * 
  */
  async function takeMoneyForPuchase( pricePerPiece , quantity ) { 
  
    const moneyTaker = document.getElementById("purchaseMoneyReceiver");
    const money = moneyTaker.value;

    if ( await isInputEmpty( money ) ) { 
      // invalid input
    
      return;
    }



  }
}

