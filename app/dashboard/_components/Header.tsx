"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {

  const path  =usePathname();
  useEffect(()=>{
    console.log(path)
  },[])



  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.svg'} alt='logo' width={160} height={100}/>
      <ul className='hidden md:flex gap-6 '>
        <Link href="/dashboard" className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path == '/dashboard' && 'text-primary font-bold'}
          `}>Dashboard</Link>
        <Link 
      href="http://localhost:8501/" 
      className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
        path === "/dashboard" ? "text-primary font-bold" : ""
      }`}
    >
      Recruiter tool
    </Link>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path == '/dashboard/Upgrade' && 'text-primary font-bold'}
          `}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer
          ${path == '/dashboard/how' && 'text-primary font-bold'}
          `}>How it Works?</li>
      </ul>
      <UserButton/>
    </div>
  )
}

export default Header