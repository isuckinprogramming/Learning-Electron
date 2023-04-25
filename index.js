
const { app,BrowserWindow, ipcMain } = require('electron');

const url = require('url');
const path = require('path');

let startUpWindow;    
let inventoryOfItem = [];

//I don't know what to do if the promise fails.
app.whenReady().then( createStartUpWindow );


ipcMain.on("siteNavigation", ( event, eventData ) => { 
    
    let fileLocation; 
    
    switch (eventData) { 
        case "MainPage": fileLocation = path.join( __dirname + "/Pages/start-up-page/start-up-page.html" );
            break;
        case "RegisterPage":  fileLocation = path.join( __dirname, "/Pages/Register-page/register-item-page.html" );
            break;
        case "InventoryPage":  fileLocation = path.join( __dirname, "/Pages/Inventory-page/item-inventory.html" );
            break;
        case "TransactionPage":  fileLocation = path.join( __dirname, "/Pages/Transactions-page/transactions-page.html" );
            break;
        case "PurchasePage":  fileLocation = path.join( __dirname, "/Pages/Purchase-page/purchase-page.html" );
            break; 
        
        default:
            // end the function if the eventData does not match any case because the chances are that 
            // the data is incorrect. And there is nowhere to redirect if that is the case.
            return;
    }
    
    startUpWindow.loadFile( fileLocation );
    }
)

const transactionDetails = [];

// Transaction Recording
ipcMain.on("transactionDataFromPurchase", ( event, eventData ) => { 
    transactionDetails.push(eventData);
    }
)


// Item Registry Events

/**
 * Contains the Items, the details associated with the item.
 * 
 * To Access an item, the key must be retrieved, the key of an 
 * item is the name of an item.
 * 
 * The data contained within the inventory will be removed after
 * runtime, data from previous use of the application will not
 * be saved.
 * 
*/
const itemStorage = new Map();

ipcMain.on("newRegisteredItem", 
    ( event, eventData ) => {
        inventoryOfItem.push(eventData);

        // event.reply( "itemInventoryFromRecords", inventoryOfItem );
    }
);

ipcMain.on("newItemToBeRegistered",
    (event, eventData) => {
        // itemStorage.push(eventData);
        itemStorage.set(eventData.name, eventData);
    }
);


//Retrieval of Inventory Data Events
ipcMain.handle( "needItemInventory",
    (event, eventData) => { 
        return itemStorage;
    }
);

ipcMain.handle("ifItemNameExistInsideInventory", ( event, eventData ) => { 
    
    if (itemStorage.has(eventData)) {
      return true;
    }

    /**
     *Would have used this code if the item storage is an array and not a map.   
     * for (let loopCounter = 0; loopCounter < itemStorage.length; loopCounter++ ) { 
          
          if ( itemStorage[ loopCounter ].name === eventData ) 
         console.log( `item found: ${ eventData } exist inside inventory, index ` )
      } 
     * 
    */ 
      return false;
  }
) 

ipcMain.handle("checkForAvailableContent", (event, eventData) => { 
    
    const quantity = +eventData.amount
    const itemToCheck = itemStorage.get( eventData.name );

    const convertedQuantity = +itemToCheck.quantity;
   
    if (quantity > convertedQuantity) { 
      //the purchase is invalid because there is not enough quantity to satisfy the demand 
      return { isItemAvailable: false };
    }
    //there is enough available quantity for the demand.
    return { isItemAvailable: true, pricePerPiece: itemToCheck.price  };
  }
)


//Modification of Inventory Data Events
ipcMain.handle("subtractItemAmount", ( event, eventData ) => { 
        
        const itemName = eventData.name;
        const amountToRemove = eventData.amount;

        const item = itemStorage.get(itemName);
        item.quantity -= amountToRemove;
    
        return item.quantity;
    }
)

//Window Start Up, function to create start-up window
function createStartUpWindow() {
    
    startUpWindow = new BrowserWindow( {
        height: 500,
        width: 500,
        webPreferences: {
            preload:  path.join(  __dirname + "/preload.js" ) ,
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
        },
        darkTheme: true,
        zoomToPageWidth: true
    }); 
        
    startUpWindow.loadFile("./Pages/start-up-page/start-up-page.html");
    
    startUpWindow.maximize();

    startUpWindow.webContents.openDevTools();
    
    startUpWindow.webContents.send( "test", { name: "testItem", price : 123, quantity: 23423 } )
}


