import { score_level, equations_data } from "./bd.js";

export default class Server
{
    static #selected_blocs = [];
    static #score_level = score_level;
    static #equations_data = equations_data;
    
    static show_selection(){ console.log(`%cSELECTION: ${this.get_selected_blocs()}%c`, 'color:#925') }
    
    //GETTERS
    static get_selected_blocs(){ return this.#selected_blocs; }
    static get_selected_blocs_nb(){ return this.#selected_blocs.length; }
    static get_selected_bloc(nb){ return this.#selected_blocs[nb]; }

    static header_data(){ return this.#score_level; }

    static getEquationGroup(index)/*:{unknowns,equations}*/{ return this.#equations_data[index]; }
    static equationsData()/*:{unknowns,equations}*/{ return this.#equations_data[this.#score_level.level]; }
    static get_equation(id)/*:string[]*/{ return this.equationsData().equations[id]; }

    //SETTERS
    static select_bloc(bloc)
    {
        if(this.#selected_blocs.length>1){ return false; }
        this.#selected_blocs.push(bloc);
        return true;
    }
    static unselect_bloc(bloc)
    {
        if(this.#selected_blocs.includes(bloc))
        {
            if(this.#selected_blocs[0]===bloc){ this.#selected_blocs.shift(); }
            else{ this.#selected_blocs.pop(); }
            return true;
        }
        return false;
    }
    static unselect_all(){ this.#selected_blocs = []; }
    
    static set_equationsContent(newVal)
    {
        this.#equations_data[this.#score_level.level].equations = newVal;
    }

    static set_equation_byId(id, newVal)
    {
        this.#equations_data[this.#score_level.level].equations[id] = newVal;
    }

    static set_header_data(score=0, level=0)
    {
        this.#score_level.score=score;
        this.#score_level.level=level;
    }
}