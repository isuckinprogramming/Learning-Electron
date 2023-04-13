
import { InventoryUtility, Item } from '../../DataStorage/InformationStorage.mjs';

const buttonToEnterMainPage = document.getElementById("returnToMainPageButton");
const buttonToRegisterItemDetails = document.getElementById("registerDetailsForItem");

const registerNameOfItemTaker = document.getElementById("ItemNameReceiver");
const registerQuantityOfItemTaker = document.getElementById("ItemQuantityReceiver");
const registerPriceOfItemTaker = document.getElementById("ItemPriceReceiver");


buttonToEnterMainPage.onclick = () => { functions.SiteNav.entryToMainPage() }

buttonToRegisterItemDetails.onclick = () => {

    // let itemDetails = `${EnterNameOfItem()} | ${EnterPriceOfItem()} | ${EnterQuantityOfItem()} | `;
    // functions.ItemManagementFunctions.sendItemsToInventory(itemDetails); 

    functions.dataSend.sendRegisteredItem( {
        nameOfItem: EnterNameOfItem(), priceOfItem: EnterPriceOfItem(), quantityOfItem: EnterQuantityOfItem()
    } );

}

function EnterNameOfItem() { 

    let name = registerNameOfItemTaker.value;    
    registerNameOfItemTaker.value = "";
    return name;
}

function EnterPriceOfItem() { 

    let price = registerPriceOfItemTaker.value;
    registerPriceOfItemTaker.value = "";
    return price;
}

function EnterQuantityOfItem() { 

    let numberOfItem = registerQuantityOfItemTaker.value;
    registerQuantityOfItemTaker.value = "";
    return numberOfItem;
}
