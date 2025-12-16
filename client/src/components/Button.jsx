export default function Button({ onClick, text, bgcolor="bg-blue-600", color="text-white", hovercolor="hover:bg-blue-700" }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 ${bgcolor} ${color} rounded ${hovercolor} transition`}
    >
      {text}
    </button>
  )
}