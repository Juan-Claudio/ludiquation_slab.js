import { Html } from '../../../../libs/slab.js';

//data.score, data.level
export default function(data)
{
    const header = new Html();

    header
    .div({class:'ludi-header'})
        .h1({class:'ludi-header-title'}).text('Ludiquation').end()
        .div({class:'ludi-header-score_level'})
            .div({class:'ludi-header-score'}).text('Score: '+data.score).end()
            .div({class:'ludi-header-level', id:"test"}).text('Level: '+data.level).end()

    .end('all')

    return header.export;
}
