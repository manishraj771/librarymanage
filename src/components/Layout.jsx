// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { 
//   BookOpen, 
//   Users, 
//   FileText, 
//   Home, 
//   Menu, 
//   X,
//   Library,
//   Plus
// } from 'lucide-react';

// const Layout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();

//   const navigation = [
//     { name: 'Dashboard', href: '/', icon: Home },
//     { name: 'Books', href: '/books', icon: BookOpen },
//     { name: 'Students', href: '/students', icon: Users },
//     { name: 'Issues', href: '/issues', icon: FileText },
//   ];

//   const quickActions = [
//     { name: 'Add Book', href: '/books/add', icon: Plus, color: 'bg-blue-500 hover:bg-blue-600' },
//     { name: 'Add Student', href: '/students/add', icon: Plus, color: 'bg-green-500 hover:bg-green-600' },
//     { name: 'Issue Book', href: '/issues/new', icon: FileText, color: 'bg-purple-500 hover:bg-purple-600' },
//   ];

//   const isActive = (href) => {
//     if (href === '/') {
//       return location.pathname === '/';
//     }
//     return location.pathname.startsWith(href);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile sidebar backdrop */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={`
//         fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
//         ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//       `}>
//         <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
//           <div className="flex items-center space-x-2">
//             <Library className="h-8 w-8 text-blue-600" />
//             <span className="text-xl font-bold text-gray-900">LibraryMS</span>
//           </div>
//           <button
//             onClick={() => setSidebarOpen(false)}
//             className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         <nav className="mt-6 px-3">
//           {navigation.map((item) => {
//             const Icon = item.icon;
//             return (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`
//                   group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 mb-1
//                   ${isActive(item.href)
//                     ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
//                     : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
//                   }
//                 `}
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <Icon className={`
//                   mr-3 h-5 w-5 transition-colors duration-200
//                   ${isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
//                 `} />
//                 {item.name}
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="mt-8 px-3">
//           <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//             Quick Actions
//           </h3>
//           {quickActions.map((action) => {
//             const Icon = action.icon;
//             return (
//               <Link
//                 key={action.name}
//                 to={action.href}
//                 className={`
//                   group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 mb-2 text-white
//                   ${action.color}
//                 `}
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <Icon className="mr-3 h-4 w-4" />
//                 {action.name}
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="lg:pl-64">
//         {/* Top navigation */}
//         <div className="bg-white shadow-sm border-b border-gray-200">
//           <div className="px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between h-16">
//               <div className="flex items-center">
//                 <button
//                   onClick={() => setSidebarOpen(true)}
//                   className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
//                 >
//                   <Menu className="h-6 w-6" />
//                 </button>
//               </div>
              
//               <div className="flex items-center space-x-4">
//                 <div className="text-sm text-gray-500">
//                   College Library Management System
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Page content */}
//         <main className="py-6">
//           <div className="px-4 sm:px-6 lg:px-8">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Users,
  FileText,
  Home,
  Menu,
  X,
  Library,
  Plus
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Books', href: '/books', icon: BookOpen },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Issues', href: '/issues', icon: FileText },
  ];

  const quickActions = [
    { name: 'Add Book', href: '/books/add', icon: Plus, color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'Add Student', href: '/students/add', icon: Plus, color: 'bg-green-500 hover:bg-green-600' },
    { name: 'Issue Book', href: '/issues/new', icon: FileText, color: 'bg-purple-500 hover:bg-purple-600' },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`
        fixed z-30 inset-y-0 left-0 w-64 transform bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:static lg:translate-x-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Library className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">LibraryMS</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1
                  ${isActive(item.href)
                    ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`
                  mr-3 h-5 w-5
                  ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                `} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 px-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-2 text-white
                  ${action.color}
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {action.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-gray-600 text-sm">College Library Management System</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
