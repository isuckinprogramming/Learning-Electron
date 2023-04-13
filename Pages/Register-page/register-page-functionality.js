
import { InventoryUtility, Item } from '../../DataStorage/InformationStorage.mjs';

const buttonToEnterMainPage = document.getElementById("returnToMainPageButton");
const buttonToRegisterItemDetails = document.getElementById("registerDetailsForItem");

const registerNameOfItemTaker = document.getElementById("ItemNameReceiver");
const registerQuantityOfItemTaker = document.getElementById("ItemQuantityReceiver");
const registerPriceOfItemTaker = document.getElementById("ItemPriceReceiver");


buttonToEnterMainPage.onclick = () => { SiteNavigation.entryToMainPage() }

buttonToRegisterItemDetails.onclick = () => {

    itemRegistry.sendItemsToInventory( {
        nameOfItem: EnterNameOfItem(),
        priceOfItem: EnterPriceOfItem(),
        quantityOfItem: EnterQuantityOfItem()
    } );
}

/**
 * Have not applied any filter yet, the user 
 * is capable of passing inputs that are invalid.
 * 
 * I want to create a filter here to stop
 * the user from entering invalid input.
*/
function EnterNameOfItem() { 

    let name = registerNameOfItemTaker.value;    
    registerNameOfItemTaker.value = "";
    return name;
}

/**
 *This function retrieves the input of the user for the  
 * price of the Item, I have not implemented any 
 * filter for this function. 
 * 
 * User can possibly provide values ranging from 0 to negative infinity,
 * or the user could enter values other than number.
 * 
 * The filter for this function can be shared with the filter for retrieving
 * the quantity the user wants to register. 
 * 
*/
function EnterPriceOfItem() { 

    let price = registerPriceOfItemTaker.value;
    registerPriceOfItemTaker.value = "";
    return price;
}


/**
 * Still have not created a filter for this function,
 * I have not yet filter out invalid input from the 
 * user. 
 * 
*/
function EnterQuantityOfItem() { 

    let numberOfItem = registerQuantityOfItemTaker.value;
    registerQuantityOfItemTaker.value = "";
    return numberOfItem;
}
