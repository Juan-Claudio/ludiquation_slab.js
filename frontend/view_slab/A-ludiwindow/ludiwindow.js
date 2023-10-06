import { Slab } from "../../../../libs/slab.js";
import ludiwindowHtml from "./ludiwindow.html.js";
import Ludiquation from '../B-ludiquation/ludiquation.js';
import Ludibloc from '../C-ludibloc/ludibloc.js';
import ludiwindowStyle from "./ludiwindow.style.js";
import ludiwindowEvents from "./ludiwindow.events.js";


const ludiwindow = new Slab(ludiwindowHtml, ludiwindowStyle, ludiwindowEvents);

ludiwindow.new_data_model(

    class Ludiwindow_model
    {
        constructor(equations, unknowns, bloc_width, bloc_height, selected_blocs)
        {
            this.unknowns = unknowns;
            this.width = 12*bloc_width;
            this.height = 4*bloc_height;
            this.bloc_width = bloc_width;
            this.bloc_height = bloc_height;
            this.equations_data = this.create_equation_data(equations, selected_blocs);
        }

        create_equation_data(equations, selected_blocs)
        {
            let formated_data = [];
            let bloc_data = [];
            let This = this;
            let end;
            equations.forEach(function(blocs_eqElmnt, key){
                bloc_data = [];
                for(let i = 0; i<blocs_eqElmnt.length; i++)
                {
                    if(i+1===blocs_eqElmnt.length){ end = 'z'; }else{ end = ''; }
                    bloc_data.push( new Ludibloc.data_model(blocs_eqElmnt[i], key, i+end, This.bloc_width, selected_blocs) );
                }
                
                formated_data.push( new Ludiquation.data_model(key, bloc_data, This.bloc_height) );
            });
            return formated_data;
        }
    }
);

export default ludiwindow;