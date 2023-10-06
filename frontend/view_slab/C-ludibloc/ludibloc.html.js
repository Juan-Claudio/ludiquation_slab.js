import { Html } from "../../../../libs/slab.js";

// data.color, data.content, data.eqId, data.blocId
export default function(data)
{
    return (
        new Html()
        .div({class:`bloc ${data.color} ${data.border} ${data.selected}`, id:`eq${data.eqId}b${data.blocId}`}).text(data.content).end()
        .export
    );
}