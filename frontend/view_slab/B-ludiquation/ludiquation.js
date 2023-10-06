import Slab from "../../../../libs/slabjs_new/Slab_new.js";
import ludiquationHtml from "./ludiquation.html.js";

const ludiquation = new Slab(ludiquationHtml);

ludiquation.new_data_model( 
    class Ludiquation_model
    {
        constructor(id, blocs_data, height)
        {
            this.eqId = id;
            this.blocs = blocs_data;
            this.height = height;
        }
    }
);

export default ludiquation;