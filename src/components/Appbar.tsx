import { ChefHat } from 'lucide-react'
import { Link } from 'react-router-dom'

const Appbar = () => {
  return (
    <div className="text-center py-5 bg-white drop-shadow-md">
      <Link className="flex items-center justify-center gap-2 mb-4" to="/">
        <ChefHat className="w-8 h-8 text-green-500" />
        <h1 className="text-3xl font-bold text-gray-800">VeganGPT</h1>
      </Link>
      <p className="text-gray-600 px-2">
        Select your ingredients and preferred cuisine for a magical recipe
        recommendation!
      </p>
    </div>
  )
}

export default Appbar
