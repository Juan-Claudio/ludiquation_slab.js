import { Html } from "../../../../libs/slab.js";

export default function(data)
{
    return new Html()
        .div({class:'success_screen', role:'alert'}).text('CORRECT!')
        .end()
        .export;
}