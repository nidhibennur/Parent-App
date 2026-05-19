import React from 'react';
import {
    Mic,
    PanelLeft,
    Square,
    SendHorizontal,
    Trophy,
    Music2,
    Code2,
    Image as ImageIcon
} from "lucide-react";

const QuickActionSidebar = () => {
    return (
        <div className="p-4 mt-5">
            <h2 className="text-lg text-info font-semibold mb-5">
                Quick Actions
            </h2>

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 gap-3">
                <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-zinc-900 bg-info">
                    <Trophy size={22} />
                    Football
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-zinc-900 bg-info">
                    <Music2 size={22} />
                    Music
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-zinc-900 bg-info">
                    <Code2 size={22} />
                    Coding
                </button>

                <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-zinc-900 bg-info">
                    <ImageIcon size={22} />
                    Images
                </button>
            </div>
        </div>
    );
};

export default QuickActionSidebar;