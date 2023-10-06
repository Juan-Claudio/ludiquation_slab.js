import appVars from './../model/app_var.js';

export default class PlayerActions
{
    static reverseEquation(index)
    {
        if(typeof(index)==='string'){ index=parseInt(index); }
        let equation = appVars.equationGroup.equations[index].join('ø');
        equation = equation.split('ø=ø');
        equation[0] = equation[0].split('ø');
        equation[1] = equation[1].split('ø');
        equation = equation[1].concat(['='],equation[0]);
        appVars.equationGroup.equations[index]=equation;
    }
}