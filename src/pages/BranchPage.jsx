import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { BRANCHES } from '../data/branches.js'
import { buildBranchCatalog } from '../data/catalog.js'
import BranchHeader from '../components/BranchHeader.jsx'
import BranchDetail from '../components/BranchDetail.jsx'

function buildTabs(branch) {
  const { programs, massagesFull, massagesPremium, massagesZone, procedures } =
    buildBranchCatalog(branch.services || [])
  const hasMassages =
    massagesFull.length > 0 || massagesPremium.length > 0 || massagesZone.length > 0 || procedures.length > 0
  return [
    { key: 'programs',    label: 'Спа-программы', show: programs.length > 0 },
    { key: 'massages',    label: 'Массажи',        show: hasMassages },
    { key: 'memberships', label: 'Абонементы',     show: !branch.comingSoon },
    { key: 'certificate', label: 'Сертификаты',    show: !branch.comingSoon },
    { key: 'vr',          label: 'ВР-тур',         show: !!branch.vrTour },
    { key: 'masters',     label: 'Мастера',        show: branch.team.length > 0 },
  ].filter((tb) => tb.show)
}

function BranchPageInner({ branch }) {
  const tabs = buildTabs(branch)
  const [tab, setTab] = useState(tabs[0]?.key || 'programs')
  const [bookOpen, setBookOpen] = useState(false)

  return (
    <>
      <BranchHeader tabs={tabs} tab={tab} setTab={setTab} onBook={() => setBookOpen(true)} />
      <BranchDetail
        branch={branch}
        tab={tab}
        setTab={setTab}
        tabs={tabs}
        bookOpen={bookOpen}
        setBookOpen={setBookOpen}
      />
    </>
  )
}

export default function BranchPage() {
  const { slug } = useParams()
  const branch = BRANCHES.find((b) => b.slug === slug)
  if (!branch) return <Navigate to="/" replace />
  return <BranchPageInner branch={branch} />
}
