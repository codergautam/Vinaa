import { unstable_getServerSession as getServerSession } from "next-auth/next"
import { authOptions } from "../pages/api/auth/[...nextauth]"

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions)
  if(!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
  }
  return {
    props: { session }
  }
}

export async function API(req, res) {
  return await getServerSession(req, res, authOptions)
}
