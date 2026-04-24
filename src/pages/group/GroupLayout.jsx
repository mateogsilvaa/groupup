import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'

export default function GroupLayout() {
  const { groupId } = useParams()
  const { groups, setCurrentGroup, fetchGroupMembers } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    const g = groups.find(g => g.id === groupId)
    if (g) {
      setCurrentGroup(g)
      fetchGroupMembers(groupId)
    } else if (groups.length > 0) {
      navigate('/dashboard')
    }
  }, [groupId, groups])

  return <Outlet />
}
