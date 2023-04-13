

export class InventoryUtility { 

    static ItemStorage = [];

    static addNewItemToStorage( ItemToAdd ) { 

        InventoryUtility.ItemStorage.push(ItemToAdd)

        console.log(
            "Information Storage: ", InventoryUtility.ItemStorage
        )
    }

    static getCopyOfAllItemsInsideInventory(){
        return InventoryUtility.ItemStorage;
    }
}

export class Item {

    name;

    price;

    quantity;

    
    getNameOfItem = () => {
        return this.name;
    }
    getPriceOfItem = () => {
        return this.price;
    }
    getQuantityOfItem = () => {
        return this.quantity
    }

    set name(nameToSet) { 
        
        this.name = this.nameToSet;
    }

    set price(priceToSet) { 
        this.price = priceToSet;
    }

    set quantity(quantityToSet) { 
        this.quantity = quantityToSet;
    }

}






