import { Slab } from "../../../../libs/slab.js";
import ludiscreencessHtml from "./ludiscreencess.html.js";


const ludiscreencess = new Slab(ludiscreencessHtml);

ludiscreencess.alert = ()=>{
    $('.success_screen')
    .css('display','flex')
    .animate({opacity:1},{
        duration:700,
        complete:()=>{
            $('.success_screen').animate({opacity:0},()=>{ $('.success_screen').css('display','none') })
        }});
};

export default ludiscreencess;