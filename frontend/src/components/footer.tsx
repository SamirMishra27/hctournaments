import Link from 'next/link'
import { INVITE_BOT_LINK, HCL_SERVER_LINK, BOTS_SERVER_LINK } from '../utils'

export default function Footer() {
    return (
        <footer className="footer w-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-[#18122B]">
            <div className="container w-2/4 my-20 flex flex-col items-center justify-evenly text-center">
                <nav className="w-full flex items-center justify-evenly px-6 text-slate-400 text-lg my-6">
                    <Link
                        href={INVITE_BOT_LINK}
                        className="hover:text-slate-300 active:text-slate-400"
                        target="_blank">
                        Invite HandCricket Bot
                    </Link>
                    <Link
                        href={BOTS_SERVER_LINK}
                        className="hover:text-slate-300 active:text-slate-400"
                        target="_blank">
                        BOTS Server
                    </Link>
                    <Link
                        href={HCL_SERVER_LINK}
                        className="hover:text-slate-300 active:text-slate-400"
                        target="_blank">
                        HandCricket Lounge
                    </Link>
                </nav>
                <p className="copyright text-slate-200 my-6">© SamirMishra27</p>
            </div>
        </footer>
    )
}
