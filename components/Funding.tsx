import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface FundingProps {
    repoUrl?: string;
    sponsorUrl?: string;
    className?: string;
    size?: number; // icon size in px
    gap?: number;  // gap between icons
}

const DEFAULT_REPO = 'https://github.com/JayNightmare/MoodMovie';
const DEFAULT_SPONSOR = 'https://github.com/sponsors/JayNightmare';

export const Funding: React.FC<FundingProps> = ({
    repoUrl = DEFAULT_REPO,
    sponsorUrl = DEFAULT_SPONSOR,
    className,
    size = 22,
    gap = 14,
}) => {
    return (
        <div
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap,
            }}
        >
            <IconLink
                href={repoUrl}
                label="GitHub Repository"
                tooltip="Source Code"
            >
                <GitHubIcon size={size} />
            </IconLink>

            <IconLink
                href={sponsorUrl}
                label="Donate"
                tooltip="Help the developer so he can continue this project"
            >
                <HeartIcon size={size} />
            </IconLink>
        </div>
    );
};

interface IconLinkProps {
    href: string;
    label: string;
    tooltip: string;
    children: React.ReactNode;
}

const IconLink: React.FC<IconLinkProps> = ({ href, label, tooltip, children }) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <a
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mm-icon-link"
                    style={{
                        color: 'inherit',
                        textDecoration: 'none',
                        lineHeight: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color .15s ease',
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            (e.currentTarget as HTMLAnchorElement).click();
                            e.preventDefault();
                        }
                    }}
                >
                    {children}
                </a>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" sideOffset={6} className="text-xs">
                {tooltip}
            </TooltipContent>
        </Tooltip>
    );
};

const GitHubIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        role="img"
        aria-hidden="true"
        fill="currentColor"
    >
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.39 7.86 10.92.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.13-3.2.7-3.88-1.36-3.88-1.36-.53-1.35-1.29-1.71-1.29-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.74 1.27 3.41.97.11-.76.41-1.27.75-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.99 0 1.99.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.67.42.36.8 1.08.8 2.19 0 1.58-.01 2.85-.01 3.24 0 .3.21.66.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
);

const HeartIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        role="img"
        aria-hidden="true"
        fill="red"
    >
        <path d="M12 21.35c-.41 0-.82-.13-1.15-.39-1.99-1.55-3.9-3.21-5.73-4.97C2.53 15.47 1 13.24 1 10.57 1 7.5 3.39 5 6.35 5c1.57 0 3.05.74 4 1.92A5.2 5.2 0 0 1 14.35 5C17.31 5 19.7 7.5 19.7 10.57c0 2.67-1.53 4.9-4.12 5.42-1.83 1.76-3.74 3.42-5.73 4.97-.33.26-.74.39-1.15.39Z" />
    </svg>
);

export default Funding;