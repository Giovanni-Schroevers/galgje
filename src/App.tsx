import React, { FormEvent, useState } from 'react';
import styles from './App.module.scss';

const App: React.FC = () => {
  const [guesses, setGuess] = useState(10)
  const [word, setWord] = useState("Onderzoeksopdrachtgerichte interceptie")
  const [guessedLetters, setGuessedLetters] = useState([] as string[])
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split("")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setWord(e.currentTarget.word.value)
  }
  
  const guessWord = (e: any) => {
    e.preventDefault()
    const letter = e.currentTarget.value
    setGuessedLetters(guessedLetters => [...guessedLetters, letter])
    if (word.indexOf(letter) > -1) {
      return
    } else {
      setGuess(guesses-1)
    }
  }

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
                  <div className={styles.whitespace}></div>
                )
              }
            </div>
            Guesses: {guesses}
            <div className={styles.letters}>
              {letters.map((letter, index) =>
                <button onClick={guessWord} value={letter} key={index} className={styles.letter} disabled={guessedLetters.indexOf(letter) > -1}>{letter}</button>
              )}
            </div>
          </div>
        }
      </div>
      <footer className={styles.footer} />
    </div>
  )
}

export default App;
