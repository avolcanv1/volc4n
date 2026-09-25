import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { About } from './components/About'
import { IdleIdCard } from './components/IdleIdCard'
import { Index } from './components/Index'
import { Quote } from './components/Quote'
import { SplitGallery } from './components/SplitGallery'
import { ContentProvider } from './context/ContentProvider'
import { ThemeProvider } from './context/ThemeProvider'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplitGallery />} />
      <Route path="/index" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/quote" element={<Quote />} />
      <Route path="/intake" element={<Quote />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <BrowserRouter>
          <AppRoutes />
          <IdleIdCard />
        </BrowserRouter>
      </ContentProvider>
    </ThemeProvider>
  )
}

export default App
