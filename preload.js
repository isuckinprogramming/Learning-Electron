const { ipcRenderer,contextBridge, webContents } = require('electron');

contextBridge.exposeInMainWorld("sendDataToMainProcess", {
    
    sendTransactionData: async (transacData) => { 
      ipcRenderer.send( "transactionDataFromPurchase" , transacData ); 
    }
  }
) 

contextBridge.exposeInMainWorld( "itemRegistry", {

    sendItemsToInventory: ( itemDetails ) => {
            
      ipcRenderer.send("newItemToBeRegistered", itemDetails);
    }
  }
)

contextBridge.exposeInMainWorld("receiveInventoryData", {
      
    /**
     * Still new to the async keyword, I understand how the await keyword works,
     * I have not practiced how to properly use the keywords.
     * 
     * I got the idea of using invoke() and asynchronous fucntions from a tutorial
     * , the async is needed because the invoke() method call is asynchronous 
     * and needs time to be fully executed, so in order to 
     * make the main thread continue without waiting for
     * the end of the function, the method call.
     * 
    */    
    requestAndWaitForInventory: async () => { 

      let itemInventory = await ipcRenderer.invoke("needItemInventory", null);
      
      //need the log in order to see the results immediately,
      //I don't understand how the debugger or debuggers work in electron
      //so I'm sticking with console.log() in order to keep track of values and changes  
      console.log( `Inventory data: ${ itemInventory }`);
        
      return itemInventory;
    },
    checkIfQuantityToPurchaseIsAvailable: async (itemName, quantity) => { 
        
      return await ipcRenderer.invoke("checkForAvailableContent",
        { name: itemName, amount: quantity } );
    }

  }
)
contextBridge.exposeInMainWorld( "SiteNavigation", {

    /**
     * Changes the current page to the Main Page.
    */
    entryToMainPage: () => { 
      ipcRenderer.send("EnterMainPageEvent");
    },
    
    /**
     * Changes the current page to the Item Registry Page.
    */
    entryToRegistry: () => { 
      console.log("user wants to enter the register page.")
      ipcRenderer.send( "UserWantsToEnterRegisterPageEvent" );
    },

    /**
    * Changes the current page to the Item Inventory Page.
    */
    entryToInventory: () => {

      ipcRenderer.send("userWantsToEnterInventoryPage", "I don't know what to send over, just need the request.")
    },

    /**
     * Changes the current page to the Item Purchase Page
     * 
    */
    entryToPurchase:  () => {
        
      ipcRenderer.send("userWantsToEnterPurchasePage", "I do not have any idea about the use cases of IPC."); 
    },

    /**
     * Changes the current page to the Transactions History Page.
    */
    entryToTransactionsHistory: () => { 

      ipcRenderer.send("userWantsToEnterTransactionsPage", "just to fulfil parameter requirements.")
    },
  }
) 

contextBridge.exposeInMainWorld( "PurchaseItem" , { 
  checkIfItemNameExist: async (nameOfItemToCheck) => { 
      return await ipcRenderer.invoke("ifItemNameExistInsideInventory", nameOfItemToCheck);    
    },
  reduceItemAmount: async () => { 
      return await ipcRenderer.invoke("TransactionReduceItemAmount", itemTransactionCredentials);
    }
  }
)

contextBridge.exposeInMainWorld( "modifyInventory" , {
  subtractItemAmountDueToPurchase: async (itemName, itemAmountToRemove) => { 
      return await ipcRenderer.invoke("subtractItemAmount", itemName, itemAmountToRemove);
    }
  }
)
