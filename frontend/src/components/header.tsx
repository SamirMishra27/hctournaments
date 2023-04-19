import Image from 'next/image'
import Link from 'next/link'

import hclogo from '../../public/assets/handcricket.png'
import { INVITE_BOT_LINK, HCL_SERVER_LINK, BOTS_SERVER_LINK } from '../utils'

export default function Header() {
    return (
        <header className="w-full h-36 md:h-20 bg-gradient-to-br from-night-blue-primary to-night-blue-accent flex items-center justify-center">
            <div className="container max-w-[96rem] h-[95%] flex flex-col md:flex-row items-center justify-evenly md:justify-between px-0 xs:px-4">
                <Link
                    href="/"
                    className="logo w-full xs:w-auto h-full px-2 flex items-center justify-center">
                    <Image
                        src={hclogo}
                        alt="hand cricket"
                        className="logo-img w-auto h-14 md:h-12"
                    />
                    <span className="logo-text text-xl xs:text-4xl md:text-3xl font-semibold text-slate-50 [text-shadow:1px_1px_1px_#000000]">
                        hctournaments
                    </span>
                </Link>
                <nav className="w-full xs:w-auto nav-links h-full flex items-center justify-evenly px-4 space-x-4">
                    <button
                        className={
                            'w-1/3 xs:w-24 sm:w-32 h-12 bg-night-blue-primary rounded-xl text-white transition-colors ' +
                            'hover:bg-[#224587] bg-night-blue-primary overflow-clip text-xs xs:text-sm sm:text-base'
                        }>
                        <Link
                            href={INVITE_BOT_LINK}
                            target="_blank"
                            className="w-full h-full flex items-center justify-center">
                            Invite Bot
                        </Link>
                    </button>
                    <button
                        className={
                            'w-1/3 xs:w-24 sm:w-32 h-12 bg-night-blue-primary rounded-xl text-white transition-colors ' +
                            'hover:bg-[#224587] bg-night-blue-primary overflow-clip'
                        }>
                        <Link
                            href={HCL_SERVER_LINK}
                            target="_blank"
                            className="w-full h-full flex items-center justify-center">
                            Super League
                        </Link>
                    </button>
                    <button
                        className={
                            'w-1/3 xs:w-24 sm:w-32 h-12 bg-night-blue-primary rounded-xl text-white transition-colors ' +
                            'hover:bg-[#224587] bg-night-blue-primary overflow-clip'
                        }>
                        <Link
                            href={BOTS_SERVER_LINK}
                            target="_blank"
                            className="w-full h-full flex items-center justify-center">
                            BOTS
                        </Link>
                    </button>
                </nav>
            </div>
        </header>
    )
}
