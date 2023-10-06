import Slab from "../../../../libs/slabjs_new/Slab_new.js";
import headerHtml from "./header.html.js";
import headerEvents from "./header.events.js";
import headerStyle from "./header.style.js";

const header = new Slab(headerHtml, headerStyle);
export default header;