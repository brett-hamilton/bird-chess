import Game from './components/Game'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Bird Chess</h1>
        <p className="app__subtitle">A feathered game of strategy</p>
      </header>
      <main className="app__main">
        <Game />
      </main>
    </div>
  )
}

export default App
