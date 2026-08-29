'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LANGS,useI18n,Lang } from '@/lib/i18n';
const LINKS=[['/','Home'],['/assistant','Assistant'],['/hospitals','Hospitals'],['/awareness','Awareness'],['/numbers','Emergency'],['/mental-health','Mental support'],['/training','Training'],['/contact','Contact']] as const;
export default function Nav(){const pathname=usePathname();const{lang,setLang}=useI18n();const[open,setOpen]=useState(false);return <header className="site-nav"><div className="nav-inner"><Link href="/" className="brand-lockup"><img src="/icons/icon-512.png" alt="AUSECOURS"/><span><strong>AU<span>SECOURS</span></strong><small>النجدة • Emergency AI</small></span></Link><button className="nav-mobile-toggle" onClick={()=>setOpen(v=>!v)} aria-label="Toggle navigation">☰</button><nav className={`nav-links ${open?'open':''}`}>{LINKS.map(([href,label])=><Link key={href} href={href} className={pathname===href?'active':''} onClick={()=>setOpen(false)}>{label}</Link>)}</nav><div className="language-switcher">{LANGS.map(l=><button key={l.code} onClick={()=>setLang(l.code as Lang)} className={lang===l.code?'active':''}>{l.code.toUpperCase()}</button>)}</div></div></header>}
