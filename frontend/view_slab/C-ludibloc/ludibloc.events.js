import Interactions from "../../../backend/controller/Interactions.js";
export default function(data)
{
    return {
        '.bloc:contains(=)': ['click', function(){
            Interactions.unselectAll();
            Interactions.reverseEquation($(this).attr('id'));
        }],
        '.bloc:not(:contains(=))': ['click', function(){
            Interactions.unOrselect_bloc($(this).attr('id'));
            Interactions.show_selection();
        }]
    };
}