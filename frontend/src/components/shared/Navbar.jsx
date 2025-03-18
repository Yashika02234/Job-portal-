import { Link } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { User2, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';

const Navbar = () => {

  const {user} = useSelector(store => store.auth);
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <div>
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Carevo<span className="text-purple-600">Portal</span>
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-8">
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <Link 
                to="/" 
                className="text-sm font-medium text-gray-700 transition-all hover:text-purple-600 relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-purple-600 after:transition-all hover:after:w-full hover:after:duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/jobs" 
                className="text-sm font-medium text-gray-700 transition-all hover:text-purple-600 relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-purple-600 after:transition-all hover:after:w-full hover:after:duration-300"
              >
                Jobs
              </Link>
            </li>
            <li>
              <Link 
                to="/browse" 
                className="text-sm font-medium text-gray-700 transition-all hover:text-purple-600 relative after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-purple-600 after:transition-all hover:after:w-full hover:after:duration-300"
              >
                Browse
              </Link>
            </li>
          </ul>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="hidden sm:inline-flex border border-purple-600 text-purple-600 transition-all duration-300 hover:bg-purple-600 hover:text-white hover:border-purple-600"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-purple-600 text-white transition-all duration-300 hover:bg-purple-900 shadow-lg hover:shadow-xl">
                  Sign up
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-purple-100 transition-all hover:ring-4 hover:ring-purple-200">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    className="object-cover"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 mr-4 shadow-lg border border-gray-800 rounded-lg overflow-hidden">
                <div className="flex flex-col divide-y divide-gray-800">
                  <div className="p-4 bg-gray-900">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-gray-700">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                          className="object-cover"
                        />
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white">CarevoPortal</h4>
                        <p className="text-xs text-gray-400">
                          Lorem ipsum dolor sit.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gray-900">
                    <Link to="/profile" className="block">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2 text-gray-300 transition-all duration-300 hover:text-white hover:bg-gray-800 hover:scale-105"
                      >
                        <User2 className="h-4 w-4" />
                        View Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-2 text-gray-300 transition-all duration-300 hover:text-white hover:bg-gray-800 hover:scale-105"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
