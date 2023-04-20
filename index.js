
const { app,BrowserWindow, ipcMain } = require('electron');

const url = require('url');
const path = require('path');

let startUpWindow;    
let inventoryOfItem = [];

//I don't know what to do if the promise fails.
app.whenReady().then( createStartUpWindow );

ipcMain.on( "MessageEvent",
    function ( event, dataFromEvent ) { 
        
        console.log(
            "Data from the renderer process" + dataFromEvent
        )

        event.reply(
            "MainThreadReply",
            "hello from main process."
        );

    }
);

// Site Navigation events
ipcMain.on( "userWantsToEnterInventoryPage",
    (event, dataFromEvent) => {
        startUpWindow.loadFile ( path.join( __dirname + "/Pages/Inventory-page/item-inventory.html" ) )
    }
)

ipcMain.on( "UserWantsToEnterRegisterPageEvent",
    function (event, dataFromEvent) { 
        
        /**
         * dataFromEvent is not really necessary, I just want to make sure that this  
         * function changes the loadfile of the startUpWindow to the intended page. 
         * 
        */
        startUpWindow.loadFile( path.join( __dirname + "/Pages/Register-page/register-item-page.html") )
        // console.log("user has entered the register page")
    }
);

ipcMain.on( "EnterMainPageEvent",
    function (event, dataFromEvent) {
        
        console.log(dataFromEvent);
        startUpWindow.loadFile( path.join( __dirname + "/Pages/start-up-page/start-up-page.html" ) );
    }
);

ipcMain.on( "userWantsToEnterPurchasePage",
    ( event, eventData ) => { 

        startUpWindow.loadFile( path.join( __dirname, "/Pages/Purchase-page/purchase-page.html" ) )
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
        
        console.log( "successful entry of data: " + eventData);
        inventoryOfItem.push(eventData);

        // event.reply( "itemInventoryFromRecords", inventoryOfItem );
    }
);

ipcMain.on("newItemToBeRegistered",
    (event, eventData) => {
        //test if variable arrived safely.
        console.log(eventData);
        
        // itemStorage.push(eventData);
        itemStorage.set(eventData.name, eventData);

        console.log(itemStorage);
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

      console.log("item found")
      return true;
    }

      // for (let loopCounter = 0; loopCounter < itemStorage.length; loopCounter++ ) { 
          
      //     if ( itemStorage[ loopCounter ].name === eventData ) 
      //     console.log( `item found: ${ eventData } exist inside inventory, index ` )
      // } 

      return false;
  }
) 

ipcMain.handle("checkForAvailableContent", (event, eventData) => { 
    
    const quantity = eventData[0]
    const itemToCheck = itemStorage.get( eventData[1] );

    if( quantity > itemToCheck.quantity ) { 
      //the purchase is invalid because there is not enough quantity to satisfy the demand 
      return { isItemAvailable: false };
    }
    //there is enough available quantity for the demand.
    return { isItemAvailable: true, pricePerPiece: itemToCheck.price  };
  }
)


//Modification of Inventory Data Events
ipcMain.handle("modifyInventory", ( event, eventData ) => { 
        
        const itemName = eventData[0];
        const amountToRemove = eventData[1];

        const originalQuantity = itemStorage.get(itemName).quantity;
        originalQuantity -= amountToRemove;
    
        return originalQuantity;
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

    
    startUpWindow.webContents.send("test", {name: "testItem", price : 123, quantity: 23423})


    /**
     *setInterval(
        testFunction, 2000
    );
    
    function testFunction() {
        
        counterVariable++;

        startUpWindow.webContents.send(
            "testEvent",
            { counterVariable: counterVariable, testVariableTwo: "a string" }
        );
    }setInterval(
        testFunction, 2000
    );
    
    function testFunction() {
        
        counterVariable++;

        startUpWindow.webContents.send(
            "testEvent",
            { counterVariable: counterVariable, testVariableTwo: "a string" }
        );
    } 
     * 
    */
}


