import React, { FormEvent, useEffect, useRef, useState } from 'react';
import styles from './App.module.scss';
import { io } from "socket.io-client";


const App: React.FC = () => {
  const [guesses, setGuess] = useState(0);
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([] as string[]);
  const [gameover, setGameover] = useState(false);
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split("");
  const socketRef = useRef<any>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socketRef.current.emit('setWord', e.currentTarget.word.value.toLowerCase());
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

  const restart = (e: any) => {
    e.preventDefault();
    socketRef.current.emit('reset');
  }

  useEffect(() => {
    socketRef.current = io("localhost:8000")
    socketRef.current.on("setWord", (data: string) => {
      setWord(data);
    })
    socketRef.current.on("setGuesses", (data: number) => {
      setGuess(data);
    })
    socketRef.current.on("setGuesedLetters", (data: string[]) => {
      setGuessedLetters(data);
    })
    socketRef.current.on("loss", () => {
      setGameover(true);
    })
    socketRef.current.on("win", () => {
      setGameover(true);
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
                <button onClick={guessWord} value={letter} key={index} className={styles.letter} disabled={guessedLetters.indexOf(letter) > -1}>{letter}</button>
              )}
            </div>
            {
              gameover && <button onClick={restart}>Restart</button>
            }
          </div>
        }
      </div>
      <footer className={styles.footer} />
    </div>
  )
}

export default App;
