import { Slab } from "../../../../libs/slab.js";
import headerHtml from "./header.html.js";
import headerStyle from "./header.style.js";

const header = new Slab(headerHtml, headerStyle);
export default header;