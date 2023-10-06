import Slab from "../../../../libs/slabjs_new/Slab_new.js";
import ludiblocEvents from "./ludibloc.events.js";
import ludiblocHtml from "./ludibloc.html.js";
import ludiblocStyle from "./ludibloc.style.js";

const ludibloc = new Slab(ludiblocHtml, ludiblocStyle, ludiblocEvents);

ludibloc.new_data_model(
    
    class Ludibloc_model{
        constructor(content, eqId, blocId, blocWidth, selected_blocs)
        {
            this.content = content;
            this.eqId = eqId;
            this.blocId = blocId;
            this.color = this.process_color();
            this.border = this.process_border();
            this.width = blocWidth;
            this.selected_blocs = selected_blocs;
            this.selected = this.process_selected();
        }
    
        process_color()
        {
            let id = parseInt(this.blocId.replace(/z/,''));
            let eqIdMod3 = this.eqId%3;
            if(this.content==='=') return 'black';
            switch(id%3)
            {
                case 0:
                    if(eqIdMod3===0) return 'blue';
                    if(eqIdMod3===1) return 'purple';
                    if(eqIdMod3===2) return 'pink';
                case 1:
                    if(eqIdMod3===0) return 'purple';
                    if(eqIdMod3===1) return 'pink';
                    if(eqIdMod3===2) return 'blue';
                case 2:
                    if(eqIdMod3===0) return 'pink';
                    if(eqIdMod3===1) return 'blue';
                    if(eqIdMod3===2) return 'purple';
                default:console.log(id%3);
            }
        }

        process_border()
        {
            let id = parseInt(this.blocId.replace(/z/,''));
            if(id===0) return 'first_bloc';
            if(/z/.test(this.blocId)) return 'last_bloc';
            return '';
        }

        process_selected()
        {
            let this_id = 'eq'+this.eqId+'b'+this.blocId;
            switch(this.selected_blocs.length)
            {
                case 1: if(this.selected_blocs[0]===this_id){ return 'selected'; } return '';
                case 2:
                    if(this.selected_blocs[0]===this_id || this.selected_blocs[1]===this_id)
                    { return 'selected'; } return '';
                default: return '';
            }
        }
    }
);

export default ludibloc;