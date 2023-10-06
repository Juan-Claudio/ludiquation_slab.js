import { Html } from "../../../../libs/slab.js"

export default function(data)
{
    return new Html()
    .div({class:"historial"})
    .text(`Mon text avec {{mavar}} incluse dedans.</div>`).end()
    .export
}