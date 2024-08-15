// src/components/Breadcrumbs.tsx

import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useTheme } from '@mui/material';

const Breadcrumbs: React.FC = () => {
    const theme = useTheme();
    const pathname = usePathname();
    const router = useRouter();

    // Split the pathname into parts
    const pathnames = pathname ? pathname.split('/').filter((x) => x) : [];
    const filteredPathnames = pathnames.filter((value) => value !== 'navigation');

    const handleNavigation = (href: string) => {
        router.push(href);
    };

    return (
        <MUIBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />}
            sx={{ color: theme.palette.primary.main }}
        >
            <Link color="inherit" href="/navigation" onClick={() => handleNavigation('/')}>
                <HomeIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
            </Link>
            {filteredPathnames.map((value, index) => {
                const isLast = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                return isLast ? (
                    <Typography color="textPrimary" key={to} sx={{ color: theme.palette.primary.main, fontSize: '18px', fontWeight: 'bold' }}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Typography>
                ) : (
                    <Link color="inherit" href={to} onClick={() => handleNavigation(to)} key={to} sx={{ color: theme.palette.primary.main }}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                    </Link>
                );
            })}
        </MUIBreadcrumbs>
    );
};

export default Breadcrumbs;
