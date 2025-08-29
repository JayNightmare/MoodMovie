import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Results from "./pages/Results";
import Match from "./pages/Match";
import { AnimatePresence } from "framer-motion";
import DevPanel from "./components/DevPanel";

function App() {
    const location = useLocation();
    const showDevPanel =
        new URLSearchParams(location.search).get("dev") === "1";

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/match" element={<Match />} />
                </Routes>
            </AnimatePresence>
            {showDevPanel && <DevPanel />}
        </div>
    );
}

export default App;
