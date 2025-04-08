
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  showText?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'outline', 
  size = 'default',
  showIcon = true,
  showText = true
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Button variant={variant} size={size} onClick={handleLogout} className={showIcon && showText ? "gap-2" : ""}>
      {showIcon && <LogOut className="h-4 w-4" />}
      {showText && <span>Logout</span>}
    </Button>
  );
};

export default LogoutButton;
