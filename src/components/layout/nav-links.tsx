// src/components/layout/nav-links.tsx

'use client';

import { FC } from 'react';
import { HomeIcon, UserPlusIcon, ShoppingCartIcon, RectangleGroupIcon, TruckIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme, Box, Tooltip } from '@mui/material';
import clsx from 'clsx';

const links = [
  { id: 0, name: 'Dashboard', href: '/navigation', icon: HomeIcon },
  { id: 1, name: 'Customer Relations', href: '/navigation/crm', icon: UserPlusIcon },
  { id: 2, name: 'EDI Fulfillment', href: '/navigation/edi', icon: ShoppingCartIcon },
  { id: 3, name: 'Human Resources', href: '/navigation/hr', icon: UserGroupIcon },
  { id: 4, name: 'Project Manager', href: '/navigation/pm', icon: RectangleGroupIcon },
  { id: 5, name: 'Warehousing', href: '/navigation/wm', icon: TruckIcon },
  { id: 6, name: 'Users', href: '/navigation/settings/users', icon: UserIcon }
];

export default function NavLinks({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const theme = useTheme();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
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
                backgroundColor: pathname === link.href ? theme.palette.action.selected : theme.palette.primary.main,
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.text.secondary,
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
