const { ipcRenderer,contextBridge, webContents } = require('electron');

contextBridge.exposeInMainWorld( "itemRegistry", {

    sendItemsToInventory: ( itemDetails ) => {
            
      ipcRenderer.send("newRegisteredItem", itemDetails);
    }
  }
)
contextBridge.exposeInMainWorld("receiveInventoryData", {
     
    requestAndWaitForInventory: async () => { 

      let itemInventory = await ipcRenderer.invoke("needItemInventory", null);
      console.log(itemInventory);
    }
  }
)
contextBridge.exposeInMainWorld( "SiteNavigation", {

    entryToMainPage: () => { 
      ipcRenderer.send("EnterMainPageEvent");
    },
    entryToRegistry: () => { 
      console.log("user wants to enter the register page.")
      ipcRenderer.send( "UserWantsToEnterRegisterPageEvent", "something to be passed" );
    },
    entryToInventory: () => {

      ipcRenderer.send("userWantsToEnterInventoryPage", "I don't know what to send over, just need the request.")
    },
    entryToPurchase:  () => {
        
      ipcRenderer.send("userWantsToEnterPurchasePage", "I do not have any idea about the use cases of IPC."); 
    },
    entryToTransactionsHistory:  () => { 

      ipcRenderer.send("userWantsToEnterTransactionsPage", "just to fulfil parameter requirements.")
    },
  }
) 



