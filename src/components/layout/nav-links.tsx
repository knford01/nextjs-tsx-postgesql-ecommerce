'use client';

import { BriefcaseIcon, CalendarIcon, CheckCircleIcon, HomeIcon, UserPlusIcon, ShoppingCartIcon, RectangleGroupIcon, TruckIcon, UserGroupIcon, CogIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme, Box, Tooltip } from '@mui/material';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import clsx from 'clsx';
import { hasAccess } from '@/utils/permissions2';
import { User } from '@/types/user';

const links = [
  { id: 0, name: 'Dashboard', href: '/navigation', icon: HomeIcon, access: '' },
  { id: 1, name: 'Calendar', href: '/navigation/calendar', icon: CalendarIcon, access: 'calendar' },
  { id: 2, name: 'Employees', href: '/navigation/employees', icon: UserGroupIcon, access: 'employees' },
  { id: 3, name: 'Customers', href: '/navigation/customers', icon: UserPlusIcon, access: 'customers' },
  { id: 4, name: 'Projects', href: '/navigation/customers/projects', icon: BriefcaseIcon, access: 'projects' },
  { id: 5, name: 'Tasks', href: '/navigation/tasks', icon: RectangleGroupIcon, access: 'tasks' },
  { id: 6, name: 'EDI Fulfillment', href: '/navigation/edi', icon: ShoppingCartIcon, access: 'edi_fulfillment' },
  { id: 7, name: 'Shopify Orders', href: '/navigation/shopify', icon: CheckCircleIcon, access: 'shopify' },
  { id: 8, name: 'Inventory', href: '/navigation/inventory', icon: ArchiveBoxIcon, access: 'inventory' },
  { id: 9, name: 'Warehousing', href: '/navigation/warehousing', icon: TruckIcon, access: 'warehousing' },
  { id: 10, name: 'Settings', href: '/navigation/settings', icon: CogIcon, access: 'settings' }
];

export default function NavLinks({ collapsed, sessionUser }: { collapsed: boolean, sessionUser?: User }) {
  const pathname = usePathname();
  const theme = useTheme();
  const combinedPermissions = useCombinedPermissions();

  const accessibleLinks = links.filter((link) => {
    return link.access === '' || hasAccess(combinedPermissions, 'navigation', link.access);
  });

  return (
    <>
      {accessibleLinks.map((link) => {
        const LinkIcon = link.icon;

        // Determine whether the link should be highlighted
        const isSelected =
          link.href !== '/navigation' &&
          ((pathname.startsWith(link.href) && !pathname.includes('/projects')) ||
            (pathname === link.href));

        return (
          <Tooltip key={link.id} title={collapsed ? link.name : ''} placement="right">
            <Box
              key={link.name}
              component={Link}
              href={link.href}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                height: 48,
                textDecoration: 'none',
                fontWeight: 'medium',
                borderColor: 'black',
                backgroundColor: isSelected
                  ? theme.palette.action.selected
                  : link.href === '/navigation' && pathname === '/navigation'
                    ? theme.palette.action.selected
                    : theme.palette.primary.main,
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.text.primary,
                },
                transition: 'background-color 0.3s, color 0.3s',
                borderRadius: 2,
                marginLeft: 1,
                marginRight: 1,
                marginBottom: 1,
              }}
              className={clsx({
                'hover:text-white': pathname === link.href,
              })}
            >
              <LinkIcon className="w-6 ml-3" />
              {!collapsed && <p className="md:block">{link.name}</p>}
            </Box>
          </Tooltip>
        );
      })}
    </>
  );
}
