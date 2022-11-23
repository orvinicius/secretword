// CSS
import "./App.css";

//React 
import { useCallback, useEffect, useState } from "react";

//data
import { wordsList } from "./data/words";

// Components 
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQty = 3;

function App() {
  //seta a Start screen como estado inicial do app
  const [gameStage, setGameStage] = useState(stages[0].name)

  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // escolhe uma categoria aleatória
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    //escolhe uma palavra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)];


    return {word, category}


  }, [words]);


// inicia o game
const startGame = useCallback(() => {
  //limpa todas as letras
  clearLetterStates();



  //escolhe a palavra e a categoria
  const { word, category } = pickWordAndCategory();

  //cria um array de letras
  let wordLetters = word.split("")

  wordLetters = wordLetters.map((l) => l.toLowerCase())


  // preencher estados
setPickedWord(word);
setPickedCategory(category);
setLetters(wordLetters);


  setGameStage(stages[1].name);
  
}, [pickWordAndCategory]);

// processa a letra digitada
const verifyLetter = (letter) => {
  
  const normalizedLetter = letter.toLowerCase()

  // verifica se a letra já foi digitada
  if(guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter) 
      ) {
        return;
      }

      // indica a letra acertada ou remove uma chance (em caso de tentativa errada)
      if (letters.includes(normalizedLetter)) {
        setGuessedLetters((actualGuessedLetters) => [
          ...actualGuessedLetters,
          normalizedLetter,
        ]);
      } else {
        setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters,
          normalizedLetter,
        ]);

        setGuesses((actualGuesses) => actualGuesses - 1);
      }

};

const clearLetterStates = () => {
  setGuessedLetters([]);
  setWrongLetters([]);
}

useEffect(() => {
  if(guesses <= 0){
    //reseta todos os estados
    clearLetterStates()

    setGameStage(stages[2].name)
  }
}, [guesses])

// checa a condição de vitória
useEffect(() => {

  const uniqueLetters = [...new Set(letters)]

  //condição de vitória
  if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
    //add pontuação
    setScore((actualScore) => actualScore += 100)

    //reinicia o jogo com nova palavra
    startGame();

  }


}, [guessedLetters, startGame, letters, gameStage]);


//reinicia o jogo
const retry = () => {
  setScore(0)
  setGuesses(guessesQty)

  setGameStage(stages[0].name)
}

  return (
    <div className="App">
      {/** Exibe a tela de acordo com a condicional*/}
     {gameStage === 'start' &&  <StartScreen startGame={startGame} />}
     {gameStage === 'game' &&  (
     <Game 
     verifyLetter={verifyLetter} 
      pickedWord={pickedWord} 
      pickedCategory={pickedCategory}
      letters={letters}
      guessedLetters={guessedLetters}
      wrongLetters={wrongLetters}
      guesses={guesses}
      score={score}
      /> 
    )}
     {gameStage === 'end' &&  <GameOver retry={retry} score={score}/> }
    </div>
  );
}

export default App;
