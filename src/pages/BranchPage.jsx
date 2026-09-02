import { useRef } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { BRANCHES } from '../data/branches.js'
import { buildBranchCatalog } from '../data/catalog.js'
import BranchHeader from '../components/BranchHeader.jsx'
import BranchDetail from '../components/BranchDetail.jsx'
import AiChat from '../components/AiChat.jsx'

function buildTabs(branch) {
  const { programs, massagesFull, massagesPremium, massagesZone, procedures } =
    buildBranchCatalog(branch.services || [])
  const hasMassages =
    massagesFull.length > 0 || massagesPremium.length > 0 || massagesZone.length > 0 || procedures.length > 0
  return [
    { id: 'programs',    label: 'Спа-программы', show: programs.length > 0 },
    { id: 'massages',    label: 'Массажи',        show: hasMassages },
    { id: 'memberships', label: 'Абонементы',     show: !branch.comingSoon },
    { id: 'certificate', label: 'Сертификаты',    show: !branch.comingSoon },
    { id: 'vr',          label: 'ВР-тур',         show: !!branch.vrTour },
    { id: 'masters',     label: 'Мастера',        show: branch.team.length > 0 },
  ].filter((tb) => tb.show)
}

function BranchPageInner({ branch }) {
  const tabs = buildTabs(branch)
  // onBook ref lets BranchHeader trigger the booking modal inside BranchDetail
  const onBook = useRef({})

  return (
    <>
      <BranchHeader tabs={tabs} onBook={() => onBook.current.open?.()} />
      <BranchDetail branch={branch} onBook={onBook.current} />
      {branch.slug === 'taukehana' && <AiChat />}
    </>
  )
}

export default function BranchPage() {
  const { slug } = useParams()
  const branch = BRANCHES.find((b) => b.slug === slug)
  if (!branch) return <Navigate to="/" replace />
  return <BranchPageInner branch={branch} />
}
