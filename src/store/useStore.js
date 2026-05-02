import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useStore = create((set, get) => ({
  user: null,
  profile: null,
  groups: [],
  currentGroup: null,
  currentGroupMembers: [],
  theme: localStorage.getItem('gu-theme') || 'light',
  loading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setGroups: (groups) => set({ groups }),
  setCurrentGroup: (g) => set({ currentGroup: g }),
  setCurrentGroupMembers: (m) => set({ currentGroupMembers: m }),
  setLoading: (v) => set({ loading: v }),

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('gu-theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    set({ theme: next })
  },

  initTheme: () => {
    const t = localStorage.getItem('gu-theme') || 'light'
    document.documentElement.classList.toggle('dark', t === 'dark')
    set({ theme: t })
  },

  fetchProfile: async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) set({ profile: data })
    return data
  },

  fetchGroups: async () => {
    const { user } = get()
    if (!user) return
    const { data: memberships } = await supabase
      .from('group_members')
      .select('group_id, role')
      .eq('user_id', user.id)
    if (!memberships?.length) { set({ groups: [] }); return }
    const ids = memberships.map(m => m.group_id)
    const { data: groups } = await supabase
      .from('groups')
      .select('*')
      .in('id', ids)
    
    // Obtener count de miembros para cada grupo
    const groupsWithCounts = await Promise.all((groups || []).map(async (g) => {
      const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', g.id)
      return {
        ...g,
        role: memberships.find(m => m.group_id === g.id)?.role || 'member',
        member_count: count || 0,
      }
    }))
    set({ groups: groupsWithCounts })
    return groupsWithCounts
  },

  fetchGroupMembers: async (groupId) => {
    const { data } = await supabase
      .from('group_members')
      .select('user_id, role, joined_at, profiles(id, full_name, username, avatar_url, email)')
      .eq('group_id', groupId)
    const seen = new Set()
    const members = (data || [])
      .filter(m => !seen.has(m.user_id) && seen.add(m.user_id))
      .map(m => ({
        id: m.user_id,
        full_name: m.profiles?.full_name ?? null,
        username: m.profiles?.username ?? null,
        avatar_url: m.profiles?.avatar_url ?? null,
        email: m.profiles?.email ?? null,
        role: m.role,
        joined_at: m.joined_at,
      }))
    set({ currentGroupMembers: members })
    return members
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null, groups: [], currentGroup: null, currentGroupMembers: [] })
  },
}))

export default useStore
