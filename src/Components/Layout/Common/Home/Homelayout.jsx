import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuConfig } from "./MenuConfig";
import Sidebar from "../../../Sidebar/Sidebar";
import Navbar from "../../../Navbar/Navbar";

function Homelayout() {
  const SIDEBAR_WIDTH = 62;
  const NAVBAR_HEIGHT = 60;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSub, setSelectedSub] = useState(0);

  const renderContent = () => {
    const menu = menuConfig[selectedIndex];
    if (!menu) return null;
    const sub = menu.subItems[selectedSub];
    if (!sub) return null;
    return sub.content;
  };

  return (
    <>
    <div
      className="h-screen w-full grid"
      style={{
        gridTemplateColumns: `${SIDEBAR_WIDTH}px 1fr`,
        gridTemplateRows: `${NAVBAR_HEIGHT}px 1fr`,
        gridTemplateAreas: `
          "sidebar navbar"
          "sidebar main"
        `,
      }}
    >
      <aside
        className="bg-[#1A57A6] z-50"
        style={{ gridArea: "sidebar" }}
      >
        <Sidebar
          menuItems={menuConfig}
          selectedIndex={selectedIndex}
          selectedSub={selectedSub}
          setSelectedIndex={setSelectedIndex}
          setSelectedSub={setSelectedSub}
        />
      </aside>

      <header
        className="bg-white z-40"
        style={{ gridArea: "navbar" }}
      >
        <Navbar />
      </header>

      <main
        className="overflow-hidden bg-white"
        style={{ gridArea: "main", height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedIndex}-${selectedSub}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.1 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
    </>
  );
}

export default React.memo(Homelayout);

