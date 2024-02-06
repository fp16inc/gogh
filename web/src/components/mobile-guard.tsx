import React from 'react'

export function MobileGuard({
  children,
}: {
  children: React.ReactNode
}) {
  if (process.env.NODE_ENV === 'development') return children

  return (
    <>
      <div className="hidden lg:block">{children}</div>
      <div className="lg:hidden h-[100dvh] text-muted-foreground text-sm grid place-content-center">
        <p>This app is not supported on mobile devices.</p>
      </div>
    </>
  )
}
