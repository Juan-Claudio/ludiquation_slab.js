import { Slab } from "../../../../libs/slab.js";
import headerEvents from "./header.events.js";
import headerHtml from "./header.html.js";
import headerStyle from "./header.style.js";

const header = new Slab(headerHtml, headerStyle, headerEvents);
export default header;