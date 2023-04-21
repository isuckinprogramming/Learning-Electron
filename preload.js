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

    entryToMainPage: () => { 
      ipcRenderer.send( "siteNavigation", "MainPage" );
    },    
    entryToRegistry: () => { 
      ipcRenderer.send( "siteNavigation", "RegisterPage");
    },
    entryToInventory: () => {
      ipcRenderer.send( "siteNavigation", "InventoryPage" )
    },
    entryToPurchase:  () => {
      ipcRenderer.send("siteNavigation", "PurchasePage"); 
    },
    entryToTransactionsHistory: () => { 
      ipcRenderer.send("siteNavigation", "TransactionPage")
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
