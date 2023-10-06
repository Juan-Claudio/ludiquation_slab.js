import ludiblocStyle from "../C-ludibloc/ludibloc.style.js";
import ludiquationStyle from "../B-ludiquation/ludiquation.style.js";
export default function(data)
{
    let all_css = Object.assign(
        {},
        ludiquationStyle(data),
        ludiblocStyle(data),

        { '.ludiwindow':{
                width: data.width,
                height: data.height
            }
        }
        );

    return all_css;
}