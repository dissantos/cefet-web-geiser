// importação de dependência(s)
import express from 'express'
import path from 'path';
import fs from 'fs';
import _ from 'underscore';

// variáveis globais deste módulo
const PORT = 3000
const db = {}
const app = express()
const __dirname = path.resolve();


// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 1-4 linhas de código (você deve usar o módulo de filesystem (fs))




// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???qual-templating-engine???');
//app.set('views', '???caminho-ate-pasta???');
// dica: 2 linhas
app.set('view engine', 'hbs');
app.set('views', 'server/views');

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json (~3 linhas)
db['players'] = JSON.parse(fs.readFileSync('server/data/jogadores.json'))['players'];
app.get('/', (req, res) => {
    res.render('index', {players: db['players']})
});


// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter ~15 linhas de código
db['gamesForPlayers'] = JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json'));
app.get('/jogador/:numero_identificador/', (req, res) => {
    const player = _.find(db['players'], (el) => {
        return req.params.numero_identificador === el.steamid;
    })
    const gamesForPlayer = db['gamesForPlayers'][req.params.numero_identificador]['games'];
    const topGames = _.sortBy(gamesForPlayer, (el) => {
        return -el['playtime_forever'];
    })
    const top5Games = _.first(topGames, 5).map(value => {
        value['hours_played'] = Math.floor(value['playtime_forever']/60);
        return value;
    });
    const gamesCount = db['gamesForPlayers'][req.params.numero_identificador]['game_count'];
    const dontPlayGames = _.countBy(gamesForPlayer, (el) => {
        return el.playtime_forever === 0;
    })['true'];

    res.render('jogador', { player: player, topGame: top5Games[0], top5Games: top5Games, gamesCount: gamesCount, dontPlayGames: dontPlayGames});
})

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static(__dirname+'/client'));

// abrir servidor na porta 3000 (constante PORT)
// dica: 1-3 linhas de código
app.listen(PORT, () => {
    console.log("Server in port "+ PORT);
});