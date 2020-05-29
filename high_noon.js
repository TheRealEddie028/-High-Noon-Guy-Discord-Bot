const Discord = require('discord.js');
const client = new Discord.Client();
const token = '/* Super Secret Token Here */';

var userPick;
var botPick;
var responses;
var results;
var result;
var hs = 0;
var hit =0;
var miss = 0;


client.on('ready', () => {
    console.log("Connected as " + client.user.tag)

    //sets activity to playing overwatch
    client.user.setActivity("Overwatch")

    //prints out the server names it's connected to
    client.guilds.cache.forEach((guild) => {
        console.log("-" + guild.name + "\n")
    })


    //handle the timing of daily message
    setTimeout(function(){ // in leftToNoon() milliseconds run this:
        sendMessage(); // sends the message once
        var dayMillseconds = 1000 * 60 * 60 * 24; 
        setInterval(function(){ // repeats every day
            sendMessage();
        }, dayMillseconds)
    }, leftToNoon())
});

function leftToNoon(){
    var d = new Date();
    return (-d + d.setHours(12,0,0,0));// hours(24hr clock), minutes, seconds, milliseconds.
}

//sending the message after making sure it's the correct channel and server
function sendMessage(){
    var guild = client.guilds.cache.get('/* Server Key */');//server ID
    if(guild && guild.channels.cache.get('/* Channel Key */')){ //channel ID
        guild.channels.cache.get('/* Channel Key */').send("**IT'S HIGHHH**"); //channel ID + Message
        console.log("High noon achieved!\n " + "Message sent.\n" )
    } 
}

//Bot selection for the RPS game
function botSelection(){
    let clintE = Math.random(); //some rng for bot pick

    if (clintE < 0.34) {
        compResult = "rock";
    } else if(clintE <= 0.67) {
        compResult = "paper";
    } else {
        compResult = "scissors";
    }
    return compResult;
}


//RPS game outcome evaluation
function gameOutcome(userPick, botPick) {
    results = {
    rock: {rock: 'Tie', paper: 'Lose', scissors: 'Win'},
    paper: {rock: 'Win', paper: 'Tie', scissors: 'Lose'},
    scissors: {rock: 'Lose', paper: 'Win', scissors: 'Tie'},
    }
    
    result = results[userPick][botPick];

    if (result =='Tie'){
        responses = "Not time to fold'em yet. (Tie)";
    }
    else if (result == 'Win'){
        responses = "I don't much like losin'.(You win)";
    }
    else if (result == 'Lose'){
        responses = "Like shootin' fish in a barrel. (You lose)";
    }
    return responses;
}


client.on('message', async msg => {

    //call and responce
    if (msg.content == 'High') {
        msg.channel.send('NOOOOOON');
        console.log("Call and Response selected successfully.\n");
    }

    //simple rng game
    else if (msg.content == 'Shoot') {
        console.log("Shoot started:")
        let cowboy = Math.random();
        if (cowboy < 0.40) {
            //miss
            miss = miss + 1;
            msg.channel.send("You better keep practicing that aim, boy.\n" + "I cant just be this lucky " + miss + " time(s). (You missed)");
            console.log("I've successfully dodged a bullet:" + miss + " time(s).");
        } else if(cowboy <= 0.95) {
            //hit
            hit = hit + 1;
            msg.channel.send("Ouch, that stung. I've been hit " + hit + " time(s) today alone.");
            console.log("I've successfully been shot:" + hit + " time(s).");
        } else {
            //headshot
            hs = hs + 1;
            msg.channel.send("Wow. That'll hurt in the morning. I've only had a bullet in my head " + hs + " time(s).");
            console.log("I've successfully been shot in the head:" + hs + " time(s).");
        }
        console.log("Shoot completed.\n")
    }

    //tells the possible commands to a user
    else if(msg.content == 'commands'){
        msg.channel.send("I can do a couple of different things:\n" + "Type 'High' for a simple call and response.\n" + "Type 'Shoot' to test your aim.\n" + "Type 'Duel' to test your wits.");
        console.log("Told them how to type words.\n")
    }

    //rps with custom responses
    else if (msg.content == 'Duel'){//maybe impliment a simple rps game?
        console.log("Duel selected:");
        await msg.reply("Please type either R, P, or S."); //sending out the challenge
        await msg.channel.send('Ready? \n **DRAW**');

        /*player sends either r p or s here
        check that player answer is valid
        and sets userPick to the appropriate choice*/

        let answer = await msg.channel.awaitMessages(() => true, {
            max: 1,
            time: 10000, //waits 10 seconds for a response 
            errors: ['time'],
        })
        
        let choice = answer.first()['cleanContent'];
        console.log("Choice:" + choice);

            if (choice.toLowerCase() == "r"){
                userPick = 'rock';
            }
            else if (choice.toLowerCase() == "p"){
                userPick = 'paper';
            }
            else if (choice.toLowerCase() == "s"){
                userPick = 'scissors';
            }
            else {
                await msg.reply("Please type a correct response.");
            }
        
        
        botPick = botSelection();//selects the bots choice and assigns
        let temp = gameOutcome(userPick, botPick);//sends the player and bot selections to be evalutated.
        await msg.reply('I picked ' + botPick);
        await msg.channel.send(temp);
        //await msg.reply(responses);//replys with the appropriate response
        
        await msg.channel.send("Please say 'Duel' to play again.")

        console.log("User Pick: " + userPick + "\nBot Pick: "+ botPick);
        console.log("Game Outcome: " + result);
        console.log("Duel completed\n");
        //unassigning all relevate variables
        userPick = '';
        botPick = '';
        results = '';
        result = '';
        responses = '';
        temp = '';
    }
});

client.login(token)
