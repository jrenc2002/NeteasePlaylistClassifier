import {
    HashRouter as Router,
    Navigate,
    Route,
    Routes,
} from 'react-router-dom';

import { GridBg } from '@/components/bg/GirdBg';
import { DockObject } from '@/components/dock/Dock';

import { Toaster } from 'react-hot-toast';
import HomeView from '@/view/HomeView.tsx';
import SettingView from '@/view/SettingView';

function App() {

    return (
        <>
            <Router>
                <div className="flex min-h-screen flex-col">
                    <GridBg>
                        <MainContent />
                    </GridBg>
                </div>
            </Router>
        </>
    )
}
const MainContent = () => {


    return (
        <main className="h-screen w-full grow">

            <div className="fixed inset-0 flex justify-center sm:px-8 bg-[#f4f4f4] dark:bg-[#303133] bg-dot-black/[0.5] dark:bg-dot-white/[0.5]">
                <div className=" pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-[#f4f4f4] dark:bg-[#303133] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:[mask-image:radial-gradient(ellipse_at_center,transparent_30%,white)] "></div>
                <div className="flex w-full max-w-7xl lg:px-8 h-screen z-10 overflow-y-auto">
                    <div
                        className="ring-1 ring-zinc-100 dark:ring-zinc-400/20 w-full bg-transparent">
                        <Routes>
                            <Route path="/" element={<Navigate to="/home" replace />} />
                            <Route path="/home" element={<HomeView />} />
                            <Route path="/setting" element={<SettingView />} />
                        </Routes>
                    </div>
                </div>
                <div><Toaster position="top-center" /></div>
                <DockObject />
            </div>
        </main>
    )
}
export default App
