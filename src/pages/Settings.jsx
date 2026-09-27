import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { changePassword, updateProfile } from '../services/authService'
import PageHeader from '../components/ui/PageHeader'

const Settings = () => {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [profileState, setProfileState] = useState({ loading: false, message: '', error: '' })
  const [passwordState, setPasswordState] = useState({ loading: false, message: '', error: '' })

  useEffect(() => {
    setProfile({ name: user?.name || '', email: user?.email || '' })
  }, [user])

  const handleProfileSubmit = async (event) => {
    event.preventDefault()
    setProfileState({ loading: true, message: '', error: '' })

    try {
      const updatedUser = await updateProfile(profile)
      setProfile(updatedUser)
      setUser(updatedUser)
      setProfileState({ loading: false, message: 'Profile updated successfully.', error: '' })
    } catch (error) {
      setProfileState({
        loading: false,
        message: '',
        error: error.response?.data?.message || 'Failed to update profile.',
      })
    }
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setPasswordState({ loading: false, message: '', error: '' })

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordState({ loading: false, message: '', error: 'New passwords do not match.' })
      return
    }

    setPasswordState({ loading: true, message: '', error: '' })

    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })

      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordState({ loading: false, message: 'Password changed successfully.', error: '' })
    } catch (error) {
      setPasswordState({
        loading: false,
        message: '',
        error: error.response?.data?.message || 'Failed to change password.',
      })
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account and security preferences."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
            <p className="mt-1 text-sm text-slate-500">Update the information shown across your dashboard.</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="settings-name" className="mb-2 block text-sm font-medium text-slate-700">Name</label>
              <input
                id="settings-name"
                value={profile.name}
                onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                required
                minLength={2}
                maxLength={50}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label htmlFor="settings-email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                id="settings-email"
                type="email"
                value={profile.email}
                onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            {profileState.message && <p className="text-sm text-emerald-600">{profileState.message}</p>}
            {profileState.error && <p className="text-sm text-red-600">{profileState.error}</p>}

            <button
              type="submit"
              disabled={profileState.loading}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {profileState.loading ? 'Saving...' : 'Save profile'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Security</h2>
            <p className="mt-1 text-sm text-slate-500">Change your password without leaving the dashboard.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="current-password" className="mb-2 block text-sm font-medium text-slate-700">Current password</label>
              <input
                id="current-password"
                type="password"
                value={passwords.currentPassword}
                onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700">New password</label>
              <input
                id="new-password"
                type="password"
                value={passwords.newPassword}
                onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })}
                required
                minLength={8}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-700">Confirm new password</label>
              <input
                id="confirm-password"
                type="password"
                value={passwords.confirmPassword}
                onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })}
                required
                minLength={8}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
              />
            </div>

            {passwordState.message && <p className="text-sm text-emerald-600">{passwordState.message}</p>}
            {passwordState.error && <p className="text-sm text-red-600">{passwordState.error}</p>}

            <button
              type="submit"
              disabled={passwordState.loading}
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {passwordState.loading ? 'Changing...' : 'Change password'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Settings
