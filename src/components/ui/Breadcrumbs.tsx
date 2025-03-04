// src/components/ui/Breadcrumbs.tsx

import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useTheme, useMediaQuery } from '@mui/material';
import clsx from 'clsx';

interface BreadcrumbsProps {
    value?: { id: number; name: string };
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ value }) => {
    const theme = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Split the pathname into parts
    const pathnames = pathname ? pathname.split('/').filter((x) => x) : [];

    type NameMapping = {
        [key: string]: string; // Maps string keys to string values
    };

    // Define the mapping object using the type
    const nameMapping: NameMapping = {
        edi: 'EDI',
        Edi: 'EDI',
    };

    return (
        <MUIBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />}
            sx={{ color: theme.palette.primary.main, fontSize: isMobile ? '14px' : '18px' }}
        >
            <Link
                color="inherit"
                onClick={() => router.push('/navigation')}
                className={clsx({ 'hover:text-white': pathname === '/navigation' })}
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
                <HomeIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
            </Link>
            {pathnames.map((value, index) => {
                const isLast = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isDashboardOnly = value === 'navigation' && pathnames.length === 1;

                if (isDashboardOnly) {
                    return (
                        <Typography
                            color="textPrimary"
                            key={to}
                            sx={{ color: theme.palette.primary.main, fontSize: '18px', fontWeight: 'bold' }}
                        >
                            Dashboard
                        </Typography>
                    );
                } else if ((value === 'navigation') && !isLast) {
                    return null; // Skip adding "Dashboard" if not the last item
                } else if (isLast) {
                    // Check if the last part is a value ID and replace it with the value name if available
                    const displayName = nameMapping[value.toLowerCase()] || (value.charAt(0).toUpperCase() + value.slice(1));
                    return (
                        <Typography
                            color="textPrimary"
                            key={to}
                            sx={{ color: theme.palette.primary.main, fontSize: '18px', fontWeight: 'bold' }}
                        >
                            {displayName}
                        </Typography>
                    );
                } else {
                    const displayName = nameMapping[value.toLowerCase()] || (value.charAt(0).toUpperCase() + value.slice(1));
                    return (
                        <Link
                            color="inherit"
                            onClick={() => router.push(to)}
                            className={clsx({ 'hover:text-white': pathname === to })}
                            key={to}
                            sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}
                        >
                            {displayName}
                        </Link>
                    );
                }
            })}
        </MUIBreadcrumbs>
    );
};

export default Breadcrumbs;
