import { useState } from "react";
import { useFlowStore } from "../state/flowStore";

export default function DevPanel() {
    const [model, setModel] = useState(
        import.meta.env.VITE_OPENROUTER_MODEL || ""
    );
    const [temp, setTemp] = useState(0.7);
    const { answers, spec } = useFlowStore();

    return (
        <div className="fixed bottom-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg w-96 text-sm">
            <h3 className="font-bold mb-2">Dev Panel</h3>
            <div>
                <label>Model:</label>
                <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-gray-700 p-1 rounded"
                />
            </div>
            <div className="mt-2">
                <label>Temperature: {temp}</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value))}
                    className="w-full"
                />
            </div>
            <div className="mt-4 max-h-48 overflow-y-auto">
                <h4 className="font-bold">Answers:</h4>
                <pre className="text-xs bg-gray-900 p-2 rounded">
                    {JSON.stringify(answers, null, 2)}
                </pre>
                <h4 className="font-bold mt-2">Spec:</h4>
                <pre className="text-xs bg-gray-900 p-2 rounded">
                    {JSON.stringify(spec, null, 2)}
                </pre>
            </div>
        </div>
    );
}
