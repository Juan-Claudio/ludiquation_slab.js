import Server from "../model/Server.js";

export default class Interactions
{        
    static resolved_equations_nb = new Array(8).fill(false);
    
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

    static equation_resolved(eqId)
    {
        let equation = Server.get_equation(eqId);
        let unknown = equation[0].replace('+','');
        let nb_resolved_eq = 0;

        console.info(`Is win with eq: [${equation.join('][')}] \nUnknown: ${unknown}\n`);

        if(equation.length>3){ console.warn('equation not resolved: length');return false; }
        if(!/^\+*[a-z]$/.test(equation[0])){ console.warn('equation not resolved: unknown');return false; }
        if(equation[2] !== Server.get_unknown_value(eqId, unknown)){ console.warn('equation not resolved: result: '+equation[2]+'!='+Server.get_unknown_value(eqId, unknown));return false; }
        
        Server.add500_toScore()
        Server.addBonus_toScore(eqId);
        this.resolved_equations_nb[eqId]=true;
        
        nb_resolved_eq = this.resolved_equations_nb
            .reduce((preVal, currVal, id)=>{
                if(id===1){ preVal = (preVal===true) ? 1 : 0; }
                return (currVal===true) ? preVal+=1 : preVal; }
            );
        
        if(nb_resolved_eq===Server.equationsData().equations.length){ Server.level_up(); }
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
        this.equation_resolved(eqId);
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

        //add × before or after parenthesis
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
        str = str.replace(/\)\(/g, ')×(');
        return str.replace(/[-+]{2,}/g, function(match){
            let nb_less = (/-/.test(match)) ? match.match(/-/g).length : 0;
            if(nb_less%2===0){ return '+'; }
            else{ return '-'; }
        })
    }

    static multiply_divide(string)
    {
        //console.warn('in: '+string);
        let secu = 0;
        
        while(/[\/×]/.test(string) && secu<=800)
        {
            //console.info('Enter in the while with string = "'+string+'"');
            string = string.replace(/[-+]*\d+(\.\d+)*[×\/][-+]*\d+(\.\d+)*/, function(match){
                let curr_op = match.split(/[×\/]/);
                let resDiv = 0;
                let resPro = 0;
                curr_op[0] = parseFloat(curr_op[0]);
                curr_op[1] = parseFloat(curr_op[1]);
                resPro = curr_op[0]*curr_op[1];
                resDiv = curr_op[0]/curr_op[1];
                if(/×/.test(match)){ return (resPro>0) ? '+'+resPro : resPro+''; }
                else{ return (resDiv>0) ? '+'+resDiv : resDiv+''; }
            })
            secu++;
        }
        //console.warn('out: '+string);
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

    //calculate string of operations without parenthesis
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
        if(decoded_member_string===''){ return 0.0; }
        //0) simplify Sign of expression
        decoded_member_string = this.simplySign(decoded_member_string);

        //1)replace parenthesis by value
        let This = this;
        let secu = 0;
        while(/\(/.test(decoded_member_string) && secu<=800)
        {
            decoded_member_string = decoded_member_string.replace(/\([\d-+/×\.]+\)/g,function(match){
                return This.calculate_portion(match.substring(1,match.length-1));
            })
            secu++;
        }
        if(secu===801){console.error('Interactions.calculate() LOOP ERROR')}
        //2) calculate the remaining expression
        return this.calculate_portion(decoded_member_string);
    }

    static isContentValid(content, doubleBloc=false)
    {
        //preformat content string
        content = this.simplySign(content.replace(/\s/g,'').toLowerCase());
                    
        if(content===''){ return 'err:empty'; }
        if(content.length>7){ return 'err:length'; }

        //check if not contains invalid char
        if(/[^a-z0-9\-\+\/\*×÷:\(\),\.]/.test(content)){ return 'err:invalid'; }
        
        //check if parenthesis correctly opened and closed
        let parentOpNb = (content.match(/\(/g) ?? []).length;
        let parentClNb = (content.match(/\)/g) ?? []).length;
        if(parentOpNb!==parentClNb){ return 'err:parent'; }
        if(content.indexOf('(')>content.indexOf(')')){ return 'err:parent'; }

        //check first and last char according to type of new bloc
        let firstChar_pattern = /^[,\.\/\*×÷:\)]/;
        if(doubleBloc){ firstChar_pattern = /^[^\+\-\*\/×÷:]/; }
        if(firstChar_pattern.test(content)){ return 'err:firstChar'; }
        if(/[^\)0-9a-z]$/.test(content)){ return 'err:lastChar'; }
        
        //check succession of chars
        if(/[^0-9][,\.]/.test(content)){ return 'err:dot'; }
        if(/[,\.][^0-9]/.test(content)){ return 'err:dot'; }
        if(/[,\.][0-9]+[,\.]/.test(content)){ return 'err:dot'; }
        if(/[\+\-][^a-z0-9\(]/.test(content)){ return 'err:sign'; }
        if(/[\/:÷\*×][^0-9a-z\(\+\-]/.test(content)){ return 'err:op'; }
        if(/[\(][^a-z0-9\+\-\(]/.test(content)){ return 'err:parentOp'; }
        
        return (
            content
            .replace(/,/g,'.')
            .replace(/\*/g,'×')
            .replace(/[÷:]/g,'/')
            );
    }

    static replaceSelectionByNewBloc(newBlocContent)
    {
        let selectedBlocsNb = Server.get_selected_blocs_nb();
        let bloc1 = Server.get_selected_bloc(0);
        let bloc1Id_arr = this.blocId_toIntArr(bloc1);

        //1)is at least one bloc selected ?
        if(selectedBlocsNb===0)
        {
            return 'err:noBlocSelected';
        }

        //2)is newBlocContent valid ?
        let contentValid = this.isContentValid(newBlocContent);
        if(/^err/.test(contentValid)){ return contentValid;}

        Server.move(bloc1Id_arr[0]);

        //3)calculate member before replace by new bloc
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
        console.info('Member %cbefore%c change (unknowns replaced × added before/after parenthesis): '+member+' = '+member_value_before, 'font-weight:bold');

        //4)calculate member with new bloc
        let bloc2 = (selectedBlocsNb===2) ? Server.get_selected_bloc(1) : false;
        let bloc2Id_arr = (selectedBlocsNb===2) ? this.blocId_toIntArr(bloc2) : false;
        let member_value_after = 0;
        let workingEquation = [].concat(equation);
        let isNewBlocValid = false;

        //member after replace by new bloc
        workingEquation[bloc1Id_arr[1]]=contentValid;
        if(selectedBlocsNb===2){ workingEquation[bloc2Id_arr[1]]=''; }
        console.log('%cEquation after replace%c', 'color:#9f1');
        console.log(workingEquation);
        
        member = this.replace_unknowns(
            workingEquation.map((val, index)=>{
                if(isInWorkingMember(index)){ return val; }
                else{ return ''; }
            }).join('')
        );
        member_value_after = this.calculate(member); //float
        console.info('Member %cafter%c change (unknowns replaced × added before/after parenthesis): '+member+' = '+member_value_after, 'font-weight:bold');

        isNewBlocValid = member_value_before===member_value_after;

        if(isNewBlocValid)
        {
            Server.set_equation_byId(
                bloc1Id_arr[0],
                workingEquation.filter( function(val){ return val!==''; })
            );
            this.score(bloc1Id_arr[0]);
            return 'correct';
        }
        else{ return 'err:noEqualBloc'; }
    }

    static addDoubleBloc(newBlocContent)
    {
        //1)is at least one bloc selected ?
        let selectedBlocsNb = Server.get_selected_blocs_nb();
        if(selectedBlocsNb===0)
        {
            console.warn('No bloc selected!');
            return 'err:noBlocSelectedEq';
        }

        //2)is newBlocContent valid ?
        let contentValid = this.isContentValid(newBlocContent, true);
        if(/^err/.test(contentValid)){ return contentValid;}

        //3)is too much blocs in ludiwindow ?
        if(Server.get_all_blocs_nb()>40){ return 'err:tooMuchBlocs' }

        //4)add blocs
        let eqId = this.blocId_toIntArr(Server.get_selected_bloc(0))[0];
        let equation = Server.get_equation(eqId);
        let equalId = equation.indexOf('=');
        switch(contentValid[0])
        {
            case '×': 
            case '/':
                equation[0] = '('+equation[0]
                equation[equalId-1] = equation[equalId-1]+')';
                equation[equalId+1] = '('+equation[equalId+1];
                equation[equation.length-1] = equation[equation.length-1]+')';
                break;
            case '+': break;
            case '-': break;
        }
        
        equation.splice(equalId,0,contentValid);
        equation.push(contentValid);
        return 'correct';
    }

    static remove2blocs()
    {   
        let bloc1_id = this.blocId_toIntArr( Server.get_selected_bloc(0) );
        let bloc2_id = this.blocId_toIntArr( Server.get_selected_bloc(1) );

        //1)Is two blocs selected ?
        if(Server.get_selected_blocs_nb()!==2)
        { return 'err:twoSelectedBlocksNeeded' }

        Server.move(bloc1_id[0]);

        //2)calculate member before cancel out
        //TODO ADD two blocks equal content ([-+] exclude) ??
        let equation = Server.get_equation(bloc1_id[0]);
        let equalId = equation.indexOf('=');
        let workingEquation = [].concat( equation );
        let member = '';
        let member_value_before = 0;
        let member_value_after = 0;
        let isLeftMember = bloc1_id[1]<equalId;

        //calulate member value before cancel out
        member = this.replace_unknowns(
            workingEquation.filter((val, index)=>{
                return ( (isLeftMember) ? index<equalId : index>equalId )
            }).join('')
        );
        member_value_before = this.calculate(member); //float

        //3)calculate member after cancel out
        member = this.replace_unknowns(
            workingEquation.filter((val, id)=>{
                if(id!==bloc1_id[1] && id!==bloc2_id[1])
                {
                    return ( (isLeftMember) ? id<equalId : id>equalId )
                }
                return false
            }).join('')
        );
        member_value_after = this.calculate(member); //float
        
        //4)Is only 2 block in the member ?
        let member_blocks_nb = (isLeftMember) ? equalId : equation.length-(equalId+1) ;
        console.info(`Member blocks number: ${equation.length} - (${equalId}+1) = ${member_blocks_nb}`);
        if(member_blocks_nb===2){ return 'err:Only2blocks' }
        
        if(member_value_before===member_value_after)
        {
            Server.set_equation_byId(
                bloc1_id[0],
                workingEquation.filter((val, id)=>{
                    return (id!==bloc1_id[1] && id!==bloc2_id[1])
                })
            );
            this.score(bloc1_id[0]);
            return 'correct';
        }
        return 'err:notCancelOut';
    }

    static combine2blocs()
    {
        //1)Is two blocs selected ?
        if(Server.get_selected_blocs_nb()!==2)
        { return 'err:twoSelectedBlocksNeeded' }

        //2)Is to blocks stuck ?
        let bloc1_id = this.blocId_toIntArr( Server.get_selected_bloc(0) );
        let bloc2_id = this.blocId_toIntArr( Server.get_selected_bloc(1) );
        if(Math.abs(bloc1_id[1]-bloc2_id[1])!==1){ return 'err:twoBlocksNotStuck'; }

        //3)Is combined block content <= 7 characters ?
        let equation = Server.get_equation( bloc1_id[0] );
        let combinedBlocs_content = equation[bloc1_id[1]] + equation[bloc2_id[1]];
        if(combinedBlocs_content.length>7){ return 'err:combinedLength'; }

        //4)Combined in same order
        let receiverBlockId = (bloc1_id[1]-bloc2_id[1]<0) ? bloc1_id[1] : bloc2_id[1];
        console.info(`receiver block: ${equation[receiverBlockId]}`)
        combinedBlocs_content = (bloc1_id[1]-bloc2_id[1]<0) ? combinedBlocs_content : equation[bloc2_id[1]] + equation[bloc1_id[1]];
        console.info('receiver block new content: '+combinedBlocs_content)
        equation[receiverBlockId] = combinedBlocs_content;
        equation.splice(receiverBlockId+1, 1);
        this.equation_resolved( bloc1_id[0] );
        return 'correct';
    }

    static trad(mess)
    {
        let traduc = {
            empty:`Psst! You forgot to introduce value.`,
            length:`Ay! To more characters in your block. Max. 7.`,
            invalid:`Outch! Forbidden characters inserted.`,
            parent:`Oups! Some trouble with your parenthesis.`,
            firstChar:`Oh! Your first character can't be here.`,
            lastChar:`Ey! Your new bloc content ends badly.`,
            dot:`Almost one dot is lost no?`,
            sign:`Almost one sign '+' or '-' is lost no?`,
            op:`Almost one operation sign has escaped you!`,
            parentOp:`Hep! Operation sign lost near a parenthesis.`,
            noBlocSelected:`Hmm.. You didn't select any block...`,
            noEqualBloc:`This block is not equal to the selection.`,
            noBlocSelectedEq:`I need almost one selected block to know what equation.`,
            tooMuchBlocs:`Too much blocks in the game. Combine blocs to do some space.`,
            notCancelOut:`Arf! These two blocks do not cancel each other out.`,
            combinedLength:`Oh Oh! Combined block content to long. Max. 7.`,
            twoSelectedBlocksNeeded:`Euh... Not enough blocks selected. 2 needed.`,
            Only2blocks:`Only two blocks, you must to convert them manually.`,
            twoBlocksNotStuck:`You can combine only two stuck blocks.`
        };
        if(!/^err:/.test(mess))
        {
            return 'Correct!';
        }
        else
        {
            return traduc[mess.replace('err:','')] ?? mess;
        }
    }

    static score(eqId)
    {
        if(Server.getMove(eqId)>=0)
        {
            console.log('move counter: '+Server.getMove(eqId));
            if(!this.equation_resolved(eqId)){ Server.add100_toScore();console.log('+100!') }
            return;
        }
        console.log('no score change');
    }
}
