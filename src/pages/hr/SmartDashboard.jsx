import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectUser, selectCompany } from '@/features/auth/authSlice'
import SmartDashboardCards from '@/components/ui/SmartDashboardCards'
import SmartUserProfile from '@/components/ui/SmartUserProfile'
import {
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BellIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const SmartDashboard = () => {
  const user = useSelector(selectUser)
  const company = useSelector(selectCompany)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const companyKey = company?.subdomain || company?.name?.toLowerCase() || 'company'

  const formatMoney = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

  // Lightweight mock metrics (replace with API later)
  const metrics = [
    { id: 'employees', label: 'Employees', value: 156, icon: UsersIcon, tone: 'blue' },
    { id: 'attendance', label: "Today's Attendance", value: '92%', icon: CalendarDaysIcon, tone: 'green' },
    { id: 'payroll', label: 'Monthly Payroll', value: formatMoney(128000), icon: CurrencyDollarIcon, tone: 'yellow' },
    { id: 'reports', label: 'Open Alerts', value: 5, icon: BellIcon, tone: 'purple' }
  ]

  const toneMap = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700'
  }

  const quickLinks = [
    { to: `/${companyKey}/overview/employees`, label: 'Add Employee', icon: UsersIcon },
    { to: `/${companyKey}/overview/payroll`, label: 'Run Payroll', icon: CurrencyDollarIcon },
    { to: `/${companyKey}/overview/analytics`, label: 'View Analytics', icon: ChartBarIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <HomeIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                HR Smart Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome back, {user?.firstName || 'User'} • {now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="w-full lg:w-96">
            <SmartUserProfile />
          </div>
        </div>

        {/* Smart action cards */}
        <div className="mb-8">
          <SmartDashboardCards />
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((m) => (
            <div key={m.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{m.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{m.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${toneMap[m.tone]}`}>
                  <m.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Activity & quick links */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <Link to={`/${companyKey}/overview/analytics`} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">View reports</Link>
              </div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { t: 'New hire added to Engineering', time: '2h ago' },
                  { t: '3 leave requests pending approval', time: '4h ago' },
                  { t: 'February payroll processed', time: 'Yesterday' }
                ].map((a, i) => (
                  <li key={i} className="py-3 flex items-start gap-3">
                    <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                      <BellIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">{a.t}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickLinks.map((q) => (
                  <Link key={q.label} to={q.to} className="group p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                        <q.icon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{q.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Announcements */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Announcements</h2>
              <div className="space-y-3">
                {[
                  { t: 'All-hands meeting on Friday', d: 'Company-wide sync at 4:00 PM' },
                  { t: 'Security training due', d: 'Complete by end of month' }
                ].map((n, i) => (
                  <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{n.t}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{n.d}</p>
                  </div>
                ))}
              </div>
              <Link to={`/${companyKey}/overview/analytics`} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-4">
                View more
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmartDashboard
