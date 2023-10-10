import HomePage from './home-page'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function Page() {
    return (
        <>
            <Header isHomepage pathways={[]} />
            <HomePage />
            <Footer />
        </>
    )
}
