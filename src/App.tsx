import { BrowserRouter, Route, Routes, useSearchParams } from 'react-router-dom'
import { About } from './components/About'
import { Gallery } from './components/Gallery'
import { Grid } from './components/Grid'
import { Index } from './components/Index'
import { ContentProvider } from './context/ContentProvider'
import { ThemeProvider } from './context/ThemeProvider'

function GalleryRoute() {
  const [searchParams] = useSearchParams()
  const slide = searchParams.get('slide') ?? 'home'
  const image = searchParams.get('image') ?? '0'
  return <Gallery key={`${slide}-${image}`} />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<GalleryRoute />} />
      <Route path="/index" element={<Index />} />
      <Route path="/grid" element={<Grid />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ContentProvider>
    </ThemeProvider>
  )
}

export default App
