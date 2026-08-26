import { useParams, Navigate } from 'react-router-dom'
import { BRANCHES } from '../data/branches.js'
import BranchDetail from '../components/BranchDetail.jsx'

export default function BranchPage() {
  const { slug } = useParams()
  const branch = BRANCHES.find((b) => b.slug === slug)

  if (!branch) return <Navigate to="/" replace />

  return <BranchDetail branch={branch} />
}
