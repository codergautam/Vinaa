import { useRouter } from 'next/router'

export default function User() {
  const router = useRouter()
  const { user } = router.query

  return <p>User: {user}</p>
}
