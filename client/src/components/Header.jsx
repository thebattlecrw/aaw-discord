import Button from "./Button"
import Link from "./Link"
import { useLocation } from "react-router-dom";



export default function Header({ isAdmin=true, isConnected=true }) {
    const { pathname } = useLocation()
    const selectedColor = 'text-blue-500'
  
  return (
    <header className="w-full bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">AAW Discord</h1>
            <div className="flex space-x-4 items-center">
                <Link 
                    href="/" 
                    text="Accueil" 
                    {...(pathname === '/' && { color: selectedColor })}
                />
                <Link
                    href="/edt"
                    text="Emplois du temps"
                    {...(pathname === '/edt' && { color: selectedColor })}
                />
                {(isConnected || isAdmin) && (
                    <Link
                        href="/edit"
                        text="Modifier"
                        {...(pathname === '/edit' && { color: selectedColor })}
                    />
                )}
                {(isAdmin) && (
                    <Link
                        href="/users"
                        text="Utilisateurs"
                        {...(pathname === '/users' && { color: selectedColor })}
                    />
                )}
                <Button 
                    onClick={() => alert('Button Clicked!')} 
                    text="Connexion" 
                />
            </div>
        </div>
    </header>
  )
}