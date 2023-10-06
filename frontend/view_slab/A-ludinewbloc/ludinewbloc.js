import { Slab } from "../../../../libs/slab.js";
import ludinewblocEvents from "./ludinewbloc.events.js";
import ludinewblocHtml from "./ludinewbloc.html.js";
import ludinewblocStyle from "./ludinewbloc.style.js";

const ludinewbloc = new Slab(ludinewblocHtml, ludinewblocStyle, ludinewblocEvents);

ludinewbloc.new_data_model(
    
    class SlabName_model{
        constructor(data)
        {
            this.data = data;
        }
    }
);

export default ludinewbloc;
