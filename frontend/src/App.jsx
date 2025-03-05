import Routes from "./routes/Routes"
import ThemeProvider from "./context/theme-context"
function App() {

  return (
    <div>
      <ThemeProvider>
        <Routes/>
      </ThemeProvider>
      
    </div>
  )
}

export default App
