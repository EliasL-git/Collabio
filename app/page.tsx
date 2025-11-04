import { redirect } from "next/navigation"
import { isSetupComplete } from "@/lib/setup"

export default async function Home() {
  const setupComplete = await isSetupComplete()
  
  if (!setupComplete) {
    redirect('/setup')
  }
  
  redirect('/auth/signin')
}
