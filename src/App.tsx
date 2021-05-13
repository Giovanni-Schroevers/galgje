import React, { FormEvent, useEffect, useRef, useState } from 'react';
import styles from './App.module.scss';
import { io } from "socket.io-client";
import Popup from 'components/Popup';
import { Button } from '@material-ui/core';


const App: React.FC = () => {
  const [guesses, setGuess] = useState(0);
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([] as string[]);
  const [gameState, setGameState] = useState("in progress" as "in progress" | "win" | "loss");
  const [popupOpen, setPopupOpen] = useState(false);
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split("");
  const socketRef = useRef<any>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitWord(e.currentTarget.word.value);
  }

  const submitWord = (word: string) => {
    socketRef.current.emit('reset');
    socketRef.current.emit('setWord', word.toLowerCase());
  }
  
  const guessWord = (e: any) => {
    e.preventDefault();
    const letter = e.currentTarget.value;
    setGuessedLetters(guessedLetters => [...guessedLetters, letter]);
    if (word.indexOf(letter) > -1) {
      socketRef.current.emit('correctGuess', letter);
    } else {
      socketRef.current.emit('incorrectGuess', letter);
    }
  }

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SERVER_URL || 'localhost:8000')
    socketRef.current.on("setWord", (data: string) => {
      setWord(data);
      setGameState("in progress")
    })
    socketRef.current.on("setGuesses", (data: number) => {
      setGuess(data);
    })
    socketRef.current.on("setGuesedLetters", (data: string[]) => {
      setGuessedLetters(data);
    })
    socketRef.current.on("loss", () => {
      setGameState("loss");
      setPopupOpen(true)
    })
    socketRef.current.on("win", () => {
      setGameState("win");
      setPopupOpen(true)
    })
  }, [])

  return (
    <div className={styles.wrapper}>
      <header className={styles.header} />
      <div className={styles.content}>
        {!word ?
          <div className={styles.setWord}>
            <form onSubmit={handleSubmit}>
              <label>
                Set a word:
                <input type="text" name="word"/>
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
          :
          <div className={styles.game}>
            <div className={styles.word}>
              {
                word.split("").map((letter, index) =>
                  letter !== " " ?
                  <div key={index} className={styles.underscore}><span className={styles.char}>{guessedLetters.indexOf(letter) > -1 && letter}</span></div>
                  :
                  <div key={index} className={styles.whitespace}></div>
                )
              }
            </div>
            Guesses: {guesses}
            <div className={styles.letters}>
              {letters.map((letter, index) =>
                <button onClick={guessWord} value={letter} key={index} className={`${styles.letter} ${word.indexOf(letter) > -1 && guessedLetters.indexOf(letter) > -1 ? styles.letterCorrect : `${guessedLetters.indexOf(letter) > -1 && styles.letterWrong}`}`} disabled={guessedLetters.indexOf(letter) > -1 || gameState !== "in progress"}>{letter.toLocaleUpperCase()}</button>
              )}
            </div>
            {
              gameState !== "in progress" && <Button color="primary" variant="contained" onClick={() => setPopupOpen(true)}>Enter word</Button>
            }
          </div>
        }
      </div>
      <Popup
        open={popupOpen}
        text="Enter a new word to start a new game."
        title={gameState === "win" ? "The word has been guessed!" : "The word was not guessed in time."}
        handleClose={() => setPopupOpen(false)}
        submitWord={submitWord}
      />

      <footer className={styles.footer} />
    </div>
  )
}

export default App;
