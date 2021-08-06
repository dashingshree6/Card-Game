let blackjackgame = {
    'you':{'scoreSpan': '#score-you', 'box': '#your-box', 'score': 0},
    'dealer':{'scoreSpan': '#score-dealer', 'box': '#dealer-box', 'score': 0},
    'cards':['2','3','4','5','6','7','8','9','10','A','J','K','Q'],
    'cardspoint':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'K':10,'Q':10,'A':[1,11]}
}

const YOU = blackjackgame['you']
const DEALER = blackjackgame['dealer']

let wincount = 0
let losecount = 0
let drawcount = 0

//Buttons
document.querySelector('#hit-button').addEventListener('click',BlackJackHit)
document.querySelector('#deal-button').addEventListener('click', BlackJackDeal)
document.querySelector('#stand-button').addEventListener('click', DealerLogic)

//To select any random card and display
function RandomCard() {
    let randomcard = blackjackgame['cards'][Math.floor ( Math.random() * blackjackgame['cards'].length)]
    return randomcard
}
//____TESTS____ //
// console.log(RandomCard()) 
// OUTPUT : 10 (Must display any random card)

//Shows card of active player on the page
function ShowCard(card, activeplayer) {
    if (activeplayer['score'] < 21){
        let cardimg = document.createElement('img')
        cardimg.src = `./images/${card}.png`
        document.querySelector(activeplayer['box']).appendChild(cardimg)
    }
}
//____TESTS____ //
// console.log(ShowCard(10,YOU)) 
// OUTPUT : undefined 

//Update the score
function UpdateScore(card, activeplayer) {
    if (activeplayer['score'] < 21){
        if (card == 'A'){  //For Ace Card
            if(activeplayer['score'] > 10){
                activeplayer['score'] += blackjackgame['cardspoint'][card][0]
            }
            else{
                activeplayer['score'] += blackjackgame['cardspoint'][card][1]
            }
        }
        else{   //Except Ace card
            activeplayer['score'] += blackjackgame['cardspoint'][card]
        } 
    }
}
//____TESTS____ //
// console.log(UpdateScore(10,YOU)) 
// OUTPUT : undefined (Must be undefined)

//Display Score
function ShowScore(activeplayer) {
    if (activeplayer['score'] > 21){
        document.querySelector(activeplayer['scoreSpan']).textContent = 'BUST!!!'
        document.querySelector(activeplayer['scoreSpan']).style.color = 'red'
    }
    else{
        document.querySelector(activeplayer['scoreSpan']).textContent = activeplayer['score']
    }
}
//____TESTS____ //
// console.log(ShowScore(YOU)) 
// OUTPUT : undefined (Must be undefined)


//Finds the winner
function FindWinner() {
    let winner
    if (YOU['score'] <= 21) {
        if (DEALER['score'] > 21 || DEALER['score'] < YOU['score']){
            winner = YOU
            wincount += 1
        } 
        else if (DEALER['score'] > YOU['score']){
            winner = DEALER
            losecount += 1
        }
        else if (DEALER['score'] == YOU['score']){
            drawcount += 1
        }
    }
    else{
        if (DEALER['score'] <= 21){
            winner = DEALER
            losecount += 1
        }
        else if (DEALER['score'] > 21){
            drawcount += 1
        }
    }
    return winner
}
//____TESTS____ //
//console.log(FindWinner());
//OUTPUT :  {scoreSpan: "#score-you", box: "#your-box", score: 21}

//Displays the winner
function ShowWinner(winner) {
    let message, messageColor
    if (winner == YOU){
        message = 'You Won!!!'
        messageColor = 'green'
    }
    else if (winner == DEALER){
        message = 'You Lost!!!'
        messageColor = 'red'
    }
    else{
        message = "It's a Draw!!!"
        messageColor = 'gold'
    }
    document.querySelector('#blackjack-result').textContent = message
    document.querySelector('#blackjack-result').style.color = messageColor
}
//____TESTS____ //
//console.log(ShowWinner(YOU));
//OUTPUT : undefined

// Update the table
function UpgradeCounter(){
    document.querySelector('#wins').innerHTML = wincount
    document.querySelector('#losses').innerHTML = losecount
    document.querySelector('#draws').innerHTML = drawcount
}
//____TESTS____ //
//console.log(UpgradeCounter());
//OUTPUT :  undefined

// Hit Button
function BlackJackHit() {
    if (DEALER['score'] == 0){
        let card = RandomCard()
        ShowCard(card, YOU)
        UpdateScore(card, YOU)
        ShowScore(YOU)
    }
}
//____TESTS____ //
//console.log(BlackJackHit());
//OUTPUT :  undefined

//Deal button
function BlackJackDeal() {
    if (YOU['score'] > 0 && DEALER['score'] > 0) {
        let allimages = document.querySelector('.flex-blackjack-row-1').querySelectorAll('img')
        for (let num=0; num < allimages.length; num++) {
            allimages[num].remove()
        }
        
        UpgradeCounter()

        YOU['score'] = 0
        DEALER['score'] = 0
        ShowScore(YOU)
        ShowScore(DEALER)
        document.querySelector('#score-you').style.color = 'black'
        document.querySelector('#score-dealer').style.color = 'black'

        document.querySelector('#blackjack-result').textContent = "Let's play again!!!"
        document.querySelector('#blackjack-result').style.color = 'black'
    }
}
//____TESTS____ //
//console.log(BlackJackDeal());
//OUTPUT :  undefined


//Dealer timer function
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

//Logic for Dealer
async function DealerLogic() {
    if (YOU['score'] > 0 && DEALER['score'] == 0){
        if (YOU['score'] > 21){
            for(let num=0; num < 2; num++){
                let card = RandomCard()
                ShowCard(card, DEALER)
                UpdateScore(card, DEALER)
                ShowScore(DEALER)

                await sleep(500)
            }
        }
        else if (YOU['score'] <= 21){
            while (YOU['score'] > DEALER['score'] && DEALER['score'] < 21){
                let card = RandomCard()
                ShowCard(card, DEALER)
                UpdateScore(card, DEALER)
                ShowScore(DEALER)

                await sleep(500)
            }
        }
        ShowWinner(FindWinner())
    }
}
//____TESTS____ //
//console.log(DealerLogic());
//OUTPUT :  Promise {<pending>}

//At the last
//console.log(DealerLogic());
//OUTPUT :  undefined