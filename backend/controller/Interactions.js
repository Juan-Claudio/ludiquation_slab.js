import Server from "../model/Server.js";

export default class Interactions
{    
    static blocId_toIntArr(str)//:[int,int]
    {
        return (
            str.replace(/eq|z/g,'')
            .split('b')
            .map((val)=>{ return parseInt(val); })
        );
    }

    static show_selection(){ Server.show_selection(); }
    
    /**
     * 
     * @param {string} blocId 
     * @returns {string|type}
     */
    static EqualBlocId_Of(blocId, intType=false)//:string|int
    {
        let eqId = this.blocId_toIntArr(blocId)[0];
        let equalId = Server.get_equation(eqId).indexOf('=');
        return (intType) ? equalId : `eq${eqId}b${equalId}`;
    }

    static isBlocsInSameMember(blocId1, blocId2)
    {
        let blocId1_arr = this.blocId_toIntArr(blocId1);
        let blocId2_arr = this.blocId_toIntArr(blocId2);
        
        //1)Are blocs in the same equation ?
        if(blocId1_arr[0]!==blocId2_arr[0]){ return false; }

        //2)Are blocs in same member ?
        let EqualIndex = this.EqualBlocId_Of(blocId1, true);
        let bloc1InFirstMember = blocId1_arr[1]<EqualIndex;
        let bloc2InFirstMember = blocId2_arr[1]<EqualIndex;
        if(bloc1InFirstMember^bloc2InFirstMember){ return false; }

        //3)Blocs are in the same member of the equation
        return true;
    }

    static reverseEquation(blocEqualId)
    {
        let eqId = this.blocId_toIntArr(blocEqualId)[0];
        let eqGroup = JSON.parse( JSON.stringify( Server.equationsData().equations ) );
        let eqWork = eqGroup[eqId];
        let left_member = [];
        let right_member = [];
        let left_side = true;
        for(let content of eqWork)
        {
            if(content==='='){ left_side=false; }
            else if(left_side){ left_member.push(content); }
            else{ right_member.push(content); }
        }
        eqGroup[eqId] = right_member.concat(['='],left_member);
        Server.set_equationsContent(eqGroup);
        console.log(`%cEQUATION nº${eqId} REVERSED%c`, "color:#038aac");
    }

    /**
     * select/unselect bloc or do nothing if impossible
     * @param {string} bloc_cliqued 
     * @returns true if action executed, else false
     */
    static unOrselect_bloc(bloc_cliqued)
    {          
        //1)Bloc cliqued is already selected ?
        let isUnselection = Server.unselect_bloc(bloc_cliqued);
        if(isUnselection){ return true; }
        
        //2)Are 2 blocs already selected ?
        let twoBlocSelected = Server.get_selected_blocs_nb()===2;
        if(twoBlocSelected){ return false; }

        //3)Is one bloc selected in same member of bloc cliqued ?
        let oneBlocSelected = Server.get_selected_blocs_nb()===1;
        if(oneBlocSelected)
        {
            let blocsInSameMember = this.isBlocsInSameMember(
                bloc_cliqued, Server.get_selected_bloc(0));
            if(!blocsInSameMember){ return false; }
        }

        //4)Select bloc cliqued.
        Server.select_bloc(bloc_cliqued); return true;
    }
    static unselectAll(){ Server.unselect_all(); }

    static replace_unknowns(member_str)
    {
        let unknowns = Server.equationsData().unknowns; //{a:15,b:17,c:5,d:1/2,x:-2};
        let regExp_str = '[';

        //add × before or after parentesis
        member_str = member_str.replace(/\w\(|\)\w/g, function(match){
            return match.replace(/\(/,'×(').replace(/\)/,')×');
        });

        for(let x in unknowns)
        {
            regExp_str+=x
        }
        regExp_str+=']';
        return (
            member_str.replace(RegExp(regExp_str,'g'), function(match, index){
                
                if(member_str[index-1]!==undefined && /\d/.test(member_str[index-1]))
                { return '×'+unknowns[match]; }
                
                if(member_str[index+1]!==undefined && /\w/.test(member_str[index+1]))
                { return unknowns[match]+'×'; }

                return unknowns[match];
            })
        );
    }

    static simplySign(str)
    {
        return str.replace(/[-+]{2,}/g, function(match){
            let nb_less = (/-/.test(match)) ? match.match(/-/g).length : 0;
            if(nb_less%2===0){ return '+'; }
            else{ return '-'; }
        })
    }

    static multiply_divide(string)
    {
        let secu = 0;
        //console.info('Interactions.multiply_divide("'+string+'":string);');
        while(/[\/×]/.test(string) && secu<=800)
        {
            //console.info('Enter in the while with string = "'+string+'"');
            string = string.replace(/[-+]*\d+(\.\d+)*[×\/][-+]*\d+(\.\d+)*/, function(match){
                let curr_op = match.split(/[×\/]/);
                curr_op[0] = parseFloat(curr_op[0]);
                curr_op[1] = parseFloat(curr_op[1]);
                if(/×/.test(match)){ return (curr_op[0]*curr_op[1])+''; }
                else{ return (curr_op[0]/curr_op[1])+''; }
            })
            secu++;
        }
        return string;
    }

    static add_sub(string)
    {
        let result = 0;
        if(!/[-+]/.test(string[0])){ string = '+'+string; }
        string.match(/[-+]\d+(\.\d+)*/g).forEach(function(val, key)
        {
            result += parseFloat(val);
        });
        return result;
    }

    //calculate string of operations without parentesis
    static calculate_portion(string)//:float
    {
        //1) simplify signs
        string = this.simplySign(string);
        //2) multiplication/division
        string = this.multiply_divide(string);
        //3) add/sub 4) return result
        return this.add_sub(string);
    }

    static calculate(decoded_member_string)
    {
        //1)replace parentesis by value
        let This = this;
        //let secu = 0;
        while(/\(/.test(decoded_member_string)/* && secu<=800*/)
        {
            decoded_member_string = decoded_member_string.replace(/\([\d-+/×]+\)/g,function(match){
                return This.calculate_portion(match.substring(1,match.length-1));
            })
            //secu++;
        }

        //2) calculate the remaining expression
        return this.calculate_portion(decoded_member_string);
    }

    static replaceSelectionByNewBloc(newBlocContent)
    {
        //1)is at least one bloc selected ?
        let selectedBlocsNb = Server.get_selected_blocs_nb();
        if(selectedBlocsNb===0){ console.warn('No bloc selected!');return false; }

        //2)calculate member before replace by new bloc
        let bloc1 = Server.get_selected_bloc(0);
        let bloc1Id_arr = this.blocId_toIntArr(bloc1);
        let equalId = this.EqualBlocId_Of(bloc1, true);
        let isLeftMember = (bloc1Id_arr[1]<equalId) ? true : false;
        let equation = Server.get_equation(bloc1Id_arr[0]);
        let member = '';
        let member_value_before = 0;

        function isInWorkingMember(index)
        {
            if(isLeftMember){ return index<equalId; }
            return index>equalId;
        }

        //member before replace by new bloc
        member = this.replace_unknowns(
            equation.map((val, index)=>{
                if(isInWorkingMember(index)){ return val; }
                else{ return ''; }
            }).join('')
        );
        member_value_before = this.calculate(member); //float
        console.info('Member %cbefore%c change (unknowns replaced × added before/after parentesis): '+member+' = '+member_value_before, 'font-weight:bold');
        

        //3)calculate member with new bloc
        let bloc2 = (selectedBlocsNb===2) ? Server.get_selected_bloc(1) : false;
        let bloc2Id_arr = (selectedBlocsNb===2) ? this.blocId_toIntArr(bloc2) : false;
        let member_value_after = 0;
        let workingEquation = [].concat(equation);
        let isNewBlocValid = false;

        //member after replace by new bloc
        workingEquation[bloc1Id_arr[1]]='';
        if(selectedBlocsNb===2){workingEquation[bloc2Id_arr[1]]='';}
        if(isLeftMember){ workingEquation.unshift(newBlocContent);equalId++; }
        else{ workingEquation.push(newBlocContent); }
        console.log('%cEquation after replace%c'+workingEquation, 'color:#9f1');
        
        member = this.replace_unknowns(
            workingEquation.map((val, index)=>{
                if(isInWorkingMember(index)){ return val; }
                else{ return ''; }
            }).join('')
        );
        member_value_after = this.calculate(member); //float
        console.info('Member %cafter%c change (unknowns replaced × added before/after parentesis): '+member+' = '+member_value_after, 'font-weight:bold');

        isNewBlocValid = member_value_before===member_value_after;

        if(isNewBlocValid){ Server.set_equation_byId(bloc1Id_arr[0], workingEquation.filter(function(val){ return val!==''; })); return true; }
        else{ return false; }
    }
}
