export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Default',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'login',
        title: 'Login',
        type: 'item',
        classes: 'nav-item',
        url: '/login',
        icon: 'login',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'register',
        title: 'Register',
        type: 'item',
        classes: 'nav-item',
        url: '/register',
        icon: 'profile',
        target: true,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'admin',
    title: 'Admin',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'user-managment',
        title: 'User Managment',
        type: 'item',
        classes: 'nav-item',
        url: '/user-managment',
        icon: 'edit',
      },
      {
        id: 'contact-managment',
        title: 'Contact Managment',
        type: 'item',
        classes: 'nav-item',
        url: '/contact-managment',
        icon: 'mail'
      },
    ]
  },
  {
    id: 'utilities',
    title: 'Default',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'logs',
        title: 'Logs',
        type: 'item',
        classes: 'nav-item',
        url: '/logs',
        icon: 'file'
      },
      {
        id: 'filter',
        title: 'Filter',
        type: 'item',
        classes: 'nav-item',
        url: '/filter',
        icon: 'filter'
      },
      {
        id: 'reports',
        title: 'Reports',
        type: 'item',
        classes: 'nav-item',
        url: '/reports',
        icon: 'file-text'
      },
      {
        id: 'IP-Lookup',
        title: 'IP Lookup',
        type: 'item',
        classes: 'nav-item',
        url: '/IP-Lookup',
        icon: 'search'
      },
      {
        id: 'profile',
        title: 'Profile',
        type: 'item',
        classes: 'nav-item',
        url: '/profile',
        icon: 'profile'
      },
    ]
  },
  {
    id: 'all',
    title: 'Us',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'contact',
        title: 'Contact',
        type: 'item',
        classes: 'nav-item',
        url: '/contact',
        icon: 'mail'
      },
    ]
  },
  {
    id: 'removed',
    title: 'Removed',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'chrome'
      },
      {
        id: 'document',
        title: 'Document',
        type: 'item',
        classes: 'nav-item',
        url: 'https://EssayesWajih.gitbook.io/mantis-angular/',
        icon: 'question',
        target: true,
        external: true
      },
      {
        id: 'typography',
        title: 'Typography',
        type: 'item',
        classes: 'nav-item',
        url: '/typography',
        icon: 'font-size'
      },
      {
        id: 'color',
        title: 'Colors',
        type: 'item',
        classes: 'nav-item',
        url: '/color',
        icon: 'bg-colors'
      },
      {
        id: 'tabler',
        title: 'Tabler',
        type: 'item',
        classes: 'nav-item',
        url: 'https://ant.design/components/icon',
        icon: 'ant-design',
        target: true,
        external: true
      }
    ]
  },
];
