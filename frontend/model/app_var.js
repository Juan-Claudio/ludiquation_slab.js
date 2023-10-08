import Server from '../../backend/model/Server.js';
import ludiwindow from '../view_slab/A-ludiwindow/ludiwindow.js';

const header_color = '#800';
const bloc_width = 50;
const bloc_height = 40;
const header_width = 12*bloc_width;

function header_data(){ return Object.assign({color:header_color, width:header_width}, Server.header_data()) }
function ludiwindow_data()
{
    return new ludiwindow.data_model(
            Server.equationsData().equations,
            Server.equationsData().unknowns,
            bloc_width, bloc_height,
            Server.get_selected_blocs()
        );
}

export { header_data, ludiwindow_data };