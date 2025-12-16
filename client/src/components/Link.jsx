import { Link as RouterLink } from 'react-router-dom';
export default function Link({ href, text, color="text-white", hovercolor="hover:text-blue-500" }) {
  return (
    <RouterLink to={href} className={`${color} ${hovercolor}`}>
      {text}
    </RouterLink>
  )
}