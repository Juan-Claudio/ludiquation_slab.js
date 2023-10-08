import { Html } from '../../../../libs/slab.js';

//data.score, data.level
export default function(data)
{
    const header = new Html();

    header
    .header({class:'ludi-header'})
        .h1({class:'ludi-header-title'}).text('Ludiquation').end()
        .div({class:'ludi-header-score_level'})
            .div({class:'ludi-header-score'}).text('Score: '+data.score).end()
            .img({class:'ludi-actions', alt:'keyboard black keys', src:'frontend/public/img/keyboard_bootstrap.svg', role:'button', 'arial-label':'open input', title:'open input'})
            .btn({id:'remove2blocs', class:'my-1 header-btn', title:'cancel two blocks each other out'}).text('✗').end()
            .div({class:'ludi-header-level', id:"test"}).text('Level: '+data.level).end()

    .end('all')

    return header.export;
}
