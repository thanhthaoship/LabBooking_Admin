"use client"

import { useState } from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { SearchInput } from '@/components/common/search-input'
import { Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SiteHeaderProps {
  title?: string
}

export function SiteHeader({ title = 'Dashboard' }: SiteHeaderProps) {
  const [search, setSearch] = useState('')
  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <span className="text-lg font-semibold tracking-wider">LAB BOOKING</span>
        </div>
        <div className="flex-1 mx-8 max-w-xl">
          <SearchInput placeholder="Search here" value={search} onChange={setSearch} className="[&_input]:rounded-full [&_input]:bg-white [&_input]:text-foreground" />
        </div>
        <div className="flex items-center gap-4">
          <button className="rounded-full border border-white/30 bg-white/10 p-2">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/images/avatar.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <div className="text-sm font-medium">Johndoe</div>
              <div className="text-xs opacity-80">Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}