
import Nav from './components/Nav';
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'
import { useScreen } from './context/ScreenContext';

function Layout() {
  return (
    <>
      <Nav />
      <div className="p-12">
        <Outlet />
        {/* page content changes here */}
      </div>
    </>
  )
}

function App() {
  const { isMobile } = useScreen();

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white">
        <div className={`${isMobile ? 'pl-4 pr-4' : 'pl-10 pr-10'}`}>
          <Nav />
        </div>
        
        <main className={`flex-grow ${isMobile ? 'pl-8 pt-12 pr-8' : 'pl-20 pt-12 pr-20'}`}>
          <Outlet />
        </main> 
        <Footer />
      </div>
    </>
  )
}

export default App
