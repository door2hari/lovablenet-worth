import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { DollarSign, LogOut, User } from 'lucide-react'
import Navigation from './Navigation'

interface HeaderProps {
  title: string
  showAddButtons?: boolean
  onAddAsset?: () => void
  onAddDebt?: () => void
  onAddMember?: () => void
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showAddButtons = false, 
  onAddAsset, 
  onAddDebt,
  onAddMember
}) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        console.error('Error signing out:', error)
      } else {
        // Redirect to login page after successful logout
        navigate('/login')
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left side - Logo and Title */}
          <div className="flex items-center min-w-0 flex-1">
            <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-2 sm:mr-3 shadow-lg flex-shrink-0">
              <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold gradient-text truncate">{title}</h1>
          </div>

          {/* Center - Navigation (Desktop) */}
          <div className="hidden md:flex items-center">
            <Navigation />
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 pl-2">
            {/* Add buttons (only show on dashboard) */}
            {showAddButtons && onAddAsset && onAddDebt && (
              <>
                <Button 
                  onClick={onAddAsset} 
                  className="button-glow text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                >
                  <span className="hidden sm:inline">Add Asset</span>
                  <span className="sm:hidden">Asset</span>
                </Button>
                <Button 
                  onClick={onAddDebt} 
                  variant="outline" 
                  className="button-glow text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                >
                  <span className="hidden sm:inline">Add Debt</span>
                  <span className="sm:hidden">Debt</span>
                </Button>
              </>
            )}

            {/* Add member button (for family page) */}
            {showAddButtons && onAddMember && (
              <Button 
                onClick={onAddMember} 
                className="button-glow text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                <span className="hidden sm:inline pr-1">Add Member</span>
                <span className="sm:hidden">Member</span>
              </Button>
            )}

            {/* User info */}
            <div className="hidden sm:flex items-center space-x-2 px-2 sm:px-3 py-1 bg-accent/50 rounded-lg">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground truncate max-w-20">
                {getUserDisplayName()}
              </span>
            </div>

            {/* Logout button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="hover:bg-destructive hover:text-destructive-foreground h-8 w-8 sm:h-9 sm:w-auto sm:px-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-border">
          <Navigation />
        </div>
      </div>
    </header>
  )
}

export default Header 