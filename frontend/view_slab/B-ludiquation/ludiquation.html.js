import { Html } from '../../../../libs/slab.js';
import ludiblocHtml from '../C-ludibloc/ludibloc.html.js';

//data.eqId
//+ data.blocs (all blocs data)
export default function(data)
{
    let bloc_complement = {eqId:data.eqId};
    
    return ( new Html()
        .div({class:'ludiquation', id:'eq'+data.eqId})
        .htmlist(data.blocs, ludiblocHtml, bloc_complement).end()
        .export
    );
}