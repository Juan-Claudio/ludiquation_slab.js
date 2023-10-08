import { Html } from "../../../../libs/slab.js";
import ludiquationHtml from "../B-ludiquation/ludiquation.html.js";

export default function(data)
{
    return (
        new Html()
        .main({class:'ludiwindow'}).htmlist(data.equations_data, ludiquationHtml).end()
        .export
    );
}