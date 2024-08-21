"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { global } from 'styled-jsx/css'
import { Button } from '../ui/button'
import { UserButton } from '@clerk/nextjs'

const Sidebar = () => {

    const pathname=usePathname();
  return (
    <aside className='sidebar'>
        <div className='flex size-full flex-col gap-4'>
            <Link href="/" className="sidebar-logo">
             <Image src="" alt="logo" width={180} height={28}/>
            </Link>

            <nav className='sidebar-nav'>
                <SignedIn>
                    <ul className='sidebar-nav_elements'>
                        {
                            navLinks.slice(0,6).map((link)=>{
                                const active=link.route===pathname

                                return(
                                    <li key={link.route} className={`sidebar-nav_element group ${active? 'bg-black-gradient text-white':'text-gray-700'}`}>
                                       <Link className="sidebar-link" href={link.route}>
                                        <Image 
                                        src={link.icon}
                                        alt="logo"
                                        width={20}
                                        height={20}
                                        className={`${active && 'brightness-200'}`}
                                        />
                                        {link.label}
                                       </Link>
                                    </li>

                                )
                            })
                        }
                        </ul>
                        <ul className='sidebar-nav_elements'>
                        {
                            navLinks.slice(6).map((link)=>{
                                const active=link.route===pathname

                                return(
                                    <li key={link.route} className={`sidebar-nav_element group ${active? 'bg-black-gradient text-white':'text-gray-700'}`}>
                                       <Link className="sidebar-link" href={link.route}>
                                        <Image 
                                        src={link.icon}
                                        alt="logo"
                                        width={20}
                                        height={20}
                                        className={`${active && 'brightness-200'}`}
                                        />
                                        {link.label}
                                       </Link>
                                    </li>

                                )
                            })
                        }
                        <li className='flex-center cursor-pointer gap-2 p-4'>
                            <UserButton showName/>
                        </li>
                    </ul>

                </SignedIn>
                 
                <SignedOut>
                    <Button asChild className='button bg-black-gradient bg-cover'>
                      <Link href="/sign-in">Login</Link>
                    </Button>
                </SignedOut>

            </nav>
        </div>
     </aside>
  )
}

export default Sidebar