import { Fragment } from 'react'

import Header from '@/components/header'
import Footer from '@/components/footer'

export default function DefaultErrorPage() {
    return (
        <Fragment>
            <Header />
            <main className="w-full flex flex-col items-center justify-evenly bg-page-primary py-20 text-center text-slate-50">
                <h1 className="text-9xl font-semibold my-12">404</h1>
                <p className="text-xl my-1">This page could not be found!</p>
                <p className="text-base mt-1 mb-12">Looks like you have hit a dead end</p>
            </main>
            <Footer />
        </Fragment>
    )
}
