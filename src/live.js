const fpl = require('./index.js');
const mysql = require('mysql');
const config = require('../config.js');

const connection = mysql.createConnection({
  host     : config.database.host,
  user     : config.database.user,
  password : config.database.password,
  database : config.database.database
});

let gameweeks = [];
for(var i = 1; i <= config.options.liveweeks; i++){
  let gameweek = "https://fantasy.premierleague.com/drf/event/"+i+"/live";
  gameweeks.push(gameweek)
}

gameweeks = gameweeks.reverse();
setInterval( () => {
  let currentGameweek = gameweeks.pop();
  fpl.live(currentGameweek, (data) => {
    data = JSON.parse(data);

    for(key in data.elements){
      if(!data.elements.hasOwnProperty(key)) continue;
      let live = {
        player_id: key,
        gameweek_id: currentGameweek.match(/\d+/)[0],
        assists: data.elements[key].stats.assists,
        bonus: data.elements[key].stats.bonus,
        bps: data.elements[key].stats.bps,
        clean_sheets: data.elements[key].stats.clean_sheets,
        goals_conceded: data.elements[key].stats.goals_conceded,
        goals_scored: data.elements[key].stats.goals_scored,
        in_dreamteam: data.elements[key].stats.in_dreamteam,
        minutes: data.elements[key].stats.minutes,
        own_goals: data.elements[key].stats.own_goals,
        penalties_missed: data.elements[key].stats.penalties_missed,
        penalties_saved: data.elements[key].stats.penalties_saved,
        red_cards: data.elements[key].stats.red_cards,
        saves: data.elements[key].stats.saves,
        total_points: data.elements[key].stats.total_points,
        yellow_cards: data.elements[key].stats.yellow_cards,
      }

      let date = new Date();
      let query = connection.query('INSERT INTO live SET ?', live, (err, result) => {
        if(err) throw(err);
      });
      console.log(date+": profile inserted:" +query.sql);
    }
  });
}, 1500);