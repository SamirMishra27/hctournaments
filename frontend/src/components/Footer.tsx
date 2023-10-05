import Image from 'next/image'
import Link from 'next/link'
import { INVITE_BOT_LINK, HCL_SERVER_LINK, BOTS_SERVER_LINK } from '../utils'
import logoGold from '@assets/trophy-gold.svg'

export default function Footer() {
    return (
        <footer className=" w-full flex items-center bg-gradient-to-br from-dark-blue to-night-blue px-4 md:px-8 py-10">
            <div className=" w-full flex flex-col md:flex-row  items-start md:items-center justify-between">
                <nav className=" flex flex-col md:flex-row items-start md:items-center justify-start [&>a]:transition gap-x-4 md:gap-x-8">
                    <Link
                        href="/"
                        className=" btn no-animation min-h-0 h-8 bg-transparent hover:bg-transparent active:bg-transparent text-sm border-none block hover:no-underline">
                        <Image
                            src={logoGold}
                            alt="cricket trophy logo"
                            className=" w-full h-full"
                        />
                    </Link>
                    <Link href="/tournaments" className=" text-slate-300 hover:text-slate-100">
                        Tournaments
                    </Link>
                    <Link
                        href={INVITE_BOT_LINK}
                        className=" text-slate-300 hover:text-slate-100"
                        target="_blank">
                        Invite HandCricket Bot
                    </Link>
                    <Link
                        href={BOTS_SERVER_LINK}
                        className=" text-slate-300 hover:text-slate-100"
                        target="_blank">
                        BOTS Server
                    </Link>
                    <Link
                        href={HCL_SERVER_LINK}
                        className=" text-slate-300 hover:text-slate-100"
                        target="_blank">
                        HandCricket Lounge
                    </Link>
                </nav>
                <p className="copyright text-slate-200 mt-6 md:m-0">© SamirMishra27</p>
            </div>
        </footer>
    )
}
