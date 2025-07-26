import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait')

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setIsMobile(width < MOBILE_BREAKPOINT)
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT)
      setOrientation(width > height ? 'landscape' : 'portrait')
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const tabletMql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      checkScreenSize()
    }

    mql.addEventListener("change", onChange)
    tabletMql.addEventListener("change", onChange)
    
    // Initial check
    checkScreenSize()
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', checkScreenSize)
    window.addEventListener('resize', checkScreenSize)

    return () => {
      mql.removeEventListener("change", onChange)
      tabletMql.removeEventListener("change", onChange)
      window.removeEventListener('orientationchange', checkScreenSize)
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  return {
    isMobile: !!isMobile,
    isTablet: !!isTablet,
    isDesktop: !isMobile && !isTablet,
    orientation
  }
}
