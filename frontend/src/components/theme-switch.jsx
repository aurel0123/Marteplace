import * as React from 'react';
import {useTheme} from '@/context/theme-context';
import {Sun, Moon , Check} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import {cn} from '@/lib/utils';

export default function ThemeSwitch() {
    const {theme, setTheme} = useTheme();

    React.useEffect(() =>{
        const ThemeColor = theme === 'dark' ? '#020817' : '#fff'
        const metaThemeColor = document.querySelector("meta[name='theme-color']")
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', ThemeColor)
        }
    }, [theme])


    return(
        <DropdownMenu modal={true}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="scale-95 rounded-full"
                >
                    <Sun className='size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                    <Moon className='absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                    <span className='sr-only'>Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align='end'>
                <DropdownMenuLabel>Thème</DropdownMenuLabel>
                <DropdownMenuSeparator/>

                <DropdownMenuItem onClick={() => setTheme('light')}>
                    Light {' '}
                    <Check  size={14}
                    className={cn('ml-auto', theme !== 'light' && 'hidden')}
                    />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                    Dark {' '}
                    <Check  size={14}
                    className={cn('ml-auto', theme !== 'dark' && 'hidden')}
                    />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                    System {' '}
                    <Check  size={14}
                    className={cn('ml-auto', theme !== 'system' && 'hidden')}
                    />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}