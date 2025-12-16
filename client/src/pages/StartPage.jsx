import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'
export default function StartPage() {
    
    return (
        <>
            <div className='header'>
                <Header />
            </div>
            <div className="App flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <Outlet />
            </div>
        </>
    )
}