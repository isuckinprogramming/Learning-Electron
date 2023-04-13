
const textTaker = document.getElementById("text-receiver");

const buttonToTriggerTakingText = document.getElementById("btn-to-take-input-from-user"); 

const buttonToEnterRegisterPage = document.getElementById("enter-register-page");
const buttonToEnterInventoryPage = document.getElementById("enter-inventory-page");
const buttonToEnterTransactionsPage = document.getElementById("enter-transactions-page");
const buttonToEnterPurchasePage = document.getElementById("enter-purchase-page");


console.log("the renderer for the main html page is hit.")

buttonToTriggerTakingText.onclick = () => { 
        let textInside = textTaker.value;   
    console.log( "Text inside the page: " + textInside );

    ipcRenderer.send( "MessageEvent", textInside );
}

buttonToEnterRegisterPage.onclick = functions.SiteNav.entryToRegistry;

buttonToEnterInventoryPage.onclick = functions.SiteNav.entryToInventory;

buttonToEnterPurchasePage.onclick = functions.SiteNav.entryToPurchase;

buttonToEnterTransactionsPage.onclick = functions.SiteNav.entryToTransactionsHistory;

window.functions.test(
    (event, varToReceive ) => { 
        console.log(            
        `Variable was received from main process.
        \nCounter variable: ${varToReceive.counterVariable}
        \ntest variable: ${varToReceive.testVariableTwo}`)
} )
