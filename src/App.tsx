import { BrowserRouter, Route, Routes, useSearchParams } from 'react-router-dom'
import { About } from './components/About'
import { Gallery } from './components/Gallery'
import { IdleIdCard } from './components/IdleIdCard'
import { Index } from './components/Index'
import { Quote } from './components/Quote'
import { ContentProvider } from './context/ContentProvider'
import { ThemeProvider } from './context/ThemeProvider'

function GalleryRoute() {
  const [searchParams] = useSearchParams()
  return <Gallery key={searchParams.get('slide') ?? 'home'} />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GalleryRoute />} />
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
