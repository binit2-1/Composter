import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const ComponentPageLayout = () => {
  const sections = [
    {
      title: 'Button Component',
      items: [
        { id: 'button-1', label: 'Button 1' },
        { id: 'button-2', label: 'Button 2' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#060010] text-white font-[font]">
      <div className="fixed w-screen h-20 bg-[#060010] shadow-[0_4px_20px_#251c35]"></div>
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid" style={{ gridTemplateColumns: '16rem 1fr', gap: '2.5rem' }}>
          <aside>
            <div className="sticky top-35">
              {sections.map((s) => (
                <div key={s.title} className="mb-8">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase mb-4">{s.title}</h3>
                  <nav className="flex flex-col gap-2">
                    {s.items.map((item) => (
                      <NavLink
                        key={item.id}
                        to={item.id}
                        className={({ isActive }) =>
                          `text-sm px-2 py-1 rounded-l-md ${isActive ? 'text-white border-l-2 border-violet-400 bg-white/2' : 'text-zinc-300 hover:text-white hover:border-l-2 hover:border-violet-400'}`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </aside>

          <main className="overflow-auto h-[70vh] pr-4 mt-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default ComponentPageLayout