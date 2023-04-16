import Image from 'next/image'
import Link from 'next/link'

import hclogo from '../../public/assets/handcricket.png'
import { INVITE_BOT_LINK, HCL_SERVER_LINK, BOTS_SERVER_LINK } from '../utils'

export default function Header() {
    return (
        <header className="w-full h-20 bg-gradient-to-br from-night-blue-primary to-night-blue-accent flex items-center justify-center">
            <div className="container max-w-[96rem] h-[95%] flex items-center justify-between px-4">
                <Link href="/" className="logo h-full px-2 flex items-center justify-center">
                    <Image src={hclogo} alt="hand cricket" className="logo-img h-3/5 w-auto" />
                    <span className="logo-text text-3xl font-semibold text-slate-50 [text-shadow:1px_1px_1px_#000000]">
                        hctournaments
                    </span>
                </Link>
                <nav className="nav-links h-full flex items-center justify-evenly px-4 space-x-4">
                    <button
                        className={
                            'w-28 h-10 bg-night-blue-primary rounded-xl text-white transition-colors ' +
                            'hover:bg-[#224587] bg-night-blue-primary'
                        }>
                        <Link href={INVITE_BOT_LINK} target="_blank" className="w-full h-full">
                            Invite Bot
                        </Link>
                    </button>
                    <button
                        className={
                            'h-10 bg-night-blue-primary rounded-xl text-white transition-colors ' +
                            'hover:bg-[#224587] bg-night-blue-primary px-3'
                        }>
                        <Link href={HCL_SERVER_LINK} target="_blank" className="w-full h-full">
                            Super League
                        </Link>
                    </button>
                    <button
                        className={
                            'w-28 h-10 bg-night-blue-primary rounded-xl text-white transition-colors ' +
                            'hover:bg-[#224587] bg-night-blue-primary'
                        }>
                        <Link href={BOTS_SERVER_LINK} target="_blank" className="w-full h-full">
                            BOTS
                        </Link>
                    </button>
                </nav>
            </div>
        </header>
    )
}
