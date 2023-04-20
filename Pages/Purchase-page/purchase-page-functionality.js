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

  const purchaseData = await purchaseProcess();
  // asynchronously send transaction data to main process.
  window.sendDataToMainProcess.sendTransactionData(
    purchaseData);
  
  // display to purchase page, transaction details

  // const display = document.getElementById("purchaseDetailsDisplayer");

  // display.innerText = "";
  // display.innerText = ` item amount before purchase: ${purchaseData.TransactionDetails.changeFromPurchase } `

  async function purchaseProcess() {

    const resultFromNameCheck = await takeNameOfItemToPurchase();

    if (!resultFromNameCheck.doesNameExist) {
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
      itemName ,
      resultFromQuantityCheck.pricePerPiece ,
      resultFromQuantityCheck.quantityToPurchase  
    )
    
    /**
     * 
     * If all three purchase sub process is succesful then the next process would be recording
     * the purchase and passing it to a new 
    */
    
    return resultFromMoneyTransaction;
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

    const resultFromAvailabilityCheck = await window.receiveInventoryData.checkIfQuantityToPurchaseIsAvailable(nameOfItem, quantity);
    
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

  async function takeMoneyForPuchase( itemName , pricePerPiece , quantity ) { 
  
    const moneyTaker = document.getElementById("purchaseMoneyReceiver");
    const rawMoneyValue = moneyTaker.value;
    
    if (await isInputEmpty(rawMoneyValue)) { 
      // blank input, which is invalid, end the functiom
    
      return new TakeUserMoneyRespond();
    }

    const money = Number( rawMoneyValue )

    if (money === NaN) { 
      //input is not a number, cannot proceed with the input, end the function
      return new TakeUserMoneyRespond();
    }
    if (money <= 0) { 
    
      /**
       * the money the user has cannot actually buy anything, 
       * since it amounts to nothing in terms of value,
       * end the fucntion. 
       * 
       * 
      */
      
      return new TakeUserMoneyRespond();
    }


    const price = quantity * pricePerPiece;
    const change = money - price;

    if (change < 0) { 

      //user does not have enough money for the purchase, so end the fucntion. 
      return new TakeUserMoneyRespond();
    }

    /**
     * send message to main process to update the amount of the item inside the inventory.
     * 
     * craete a transaction message
     * 
     * return values representing successful transaction  
    */
    
    const amountAfterPurchase = await window.modifyInventory.subtractItemAmountDueToPurchase({ name: itemName , amount:quantity } )
    
    const itemDetails = [itemName, quantity, pricePerPiece];
    const purchaseDetails = [amountAfterPurchase, money ,change]
    const transactionDetails = new TransactionRecords( itemDetails, purchaseDetails );
    
    return new TakeUserMoneyRespond(true, true, transactionDetails);
  }
}

/**
 * Shows the status of the function responsible for taking the user money, 
 * by default the values represent an unsuccessful process, if the function
 * is successful then the default values should be reassigned during 
 * initialization.
 * 
 * Upon constructing an instance of this object, all fields of this object must
 * be reassigned, the constructor handles the reassignment, the values for 
 * the fields must correspond according to their respective order.
 * 
 * 
 * @constructor
 * @param { boolean } isInputValid - is raw input qualified for furthere processing 
 * @param { boolean } isTransactionValid - is there no problems during transaction processing 
 * @param { TransactionRecords } transactionDetails - holds information of transaction
 * 
 * 
*/
class TakeUserMoneyRespond {

  constructor( isInputValid, isTransactionValid , transactionDetails ) { 
    
    this.isInputValid = isInputValid;
    this.isTransactionSuccessful = isTransactionValid ;
    this.TransactionDetails = transactionDetails;
  }

  isInputValid = false;
  
  isTransactionSuccessful = false; 

  TransactionDetails = null;
}

/**
 *Holds all details for a single transaction.
 *
 * @constructor
 * @param { any[] } itemDetails - Contain basic item Information
 * @param { any[] } purchaseDetails - Contain Transaction Information 
 * 
 * 
 * itemDetails[0] - name of item,
 * 
 * itemDetails[1] - item price per piece
 * 
 * itemDetails[2] - item amount before purchase
 * 
 *  
 * purchaseDetails[0] - amount of item after purchase 
 * 
 * purchaseDetails[1] - money the user paid for the transaction
 * 
 * purchaseDetails[2] - change to the user
 *  
*/
class TransactionRecords { 
  
  constructor( itemDetails, purchaseDetails ) { 

    this.recordItemDetails(itemDetails)
    this.recordPurchaseDetails(purchaseDetails) 
  }

  recordItemDetails = async (itemDetails) => {
    this.itemName = itemDetails[0];
    this.itemAmountBeforePurchase = itemDetails[1];
    this.itemPrice = itemDetails[2];
  }

  recordPurchaseDetails = async (purchaseDetails) => {
    this.itemAmountAfterPurchase = purchaseDetails[0]; 
    this.moneyForPurchase = purchaseDetails[1];
    this.changeFromPurchase = purchaseDetails[2];
  }
  // basic item credentials
  
  _itemName;
  get itemName() {
    return this._itemName;
  }
  set itemName(value) {
    this._itemName = value;
  }
  
  _itemPrice;
  get itemPrice() {
    return this._itemPrice;
  }
  set itemPrice(value) {
    this._itemPrice = value;
  }

  _itemAmountBeforePurchase;
  get itemAmountBeforePurchase() {
    return this._itemAmountBeforePurchase;
  }
  set itemAmountBeforePurchase(value) {
    this._itemAmountBeforePurchase = value;
  }
  
  // after purchase credentials
  
  _itemAmountAfterPurchase;
  get itemAmountAfterPurchase() {
    return this._itemAmountAfterPurchase;
  }
  set itemAmountAfterPurchase(value) {
    this._itemAmountAfterPurchase = value;
  }
  
  _moneyForPurchase;
  get moneyForPurchase() {
    return this._moneyForPurchase;
  }
  set moneyForPurchase(value) {
    this._moneyForPurchase = value;
  }

  _changeFromPurchase;
  get changeFromPurchase() {
    return this._changeFromPurchase;
  }
  set changeFromPurchase(value) {
    this._changeFromPurchase = value;
  }
}