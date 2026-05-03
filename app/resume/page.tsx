'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Send } from 'lucide-react';
import Navigation from '@/components/AppNavigation';

const API_URL = "http://127.0.0.1:8000";

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
}

export default function ResumeParserPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 'initial', sender: 'bot', text: 'Upload a resume to begin.' }
    ]);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<{ message: string, type: 'info' | 'success' | 'error' }>({ message: '', type: 'info' });
    const [inputQuestion, setInputQuestion] = useState('');
    const [isReady, setIsReady] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a PDF file first.");
            return;
        }

        setStatus({ message: 'Processing and Embedding... Please wait.', type: 'info' });

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ message: `✅ ${data.message}`, type: 'success' });
                setIsReady(true);
                setMessages((prev: Message[]) => [...prev, { id: 'ready', sender: 'bot', text: 'Resume loaded. What would you like to know?' }]);
            } else {
                throw new Error(data.detail || "Upload failed");
            }
        } catch (error: any) {
            setStatus({ message: `❌ Error: ${error.message}`, type: 'error' });
        }
    };

    const handleSendMessage = async () => {
        const question = inputQuestion.trim();
        if (!question || !isReady) return;

        const userMessageId = Date.now().toString();
        setMessages((prev: Message[]) => [...prev, { id: userMessageId, sender: 'user', text: question }]);
        setInputQuestion('');

        const loadingId = (Date.now() + 1).toString();
        setMessages((prev: Message[]) => [...prev, { id: loadingId, sender: 'bot', text: 'Thinking...' }]);

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });

            const data = await response.json();

            setMessages(prev => prev.map(msg =>
                msg.id === loadingId ? { ...msg, text: data.answer || data.detail } : msg
            ));

        } catch (error) {
            setMessages(prev => prev.map(msg =>
                msg.id === loadingId ? { ...msg, text: 'Error connecting to backend.' } : msg
            ));
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#fafaf9]">
            <Navigation activePage="dashboard" setActivePage={() => { }} />

            <main className="flex-1 flex flex-col items-center justify-center py-10 px-4">
                <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-[#ddd] overflow-hidden flex flex-col h-[85vh]">
                    {/* Header */}
                    <header className="bg-[#2c3e50] text-white p-5 text-center">
                        <h1 className="text-2xl font-semibold">Strict Resume Q&A</h1>
                        <p className="text-sm opacity-80 mt-1">Upload a resume and ask questions. Hallucination-free parsing.</p>
                    </header>

                    {/* Upload Section */}
                    <section className="bg-[#ecf0f1] p-5 border-b border-[#ddd] flex items-center gap-4">
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#3498db] file:text-white hover:file:bg-[#2980b9] cursor-pointer"
                        />
                        <button
                            onClick={handleUpload}
                            className="bg-[#3498db] hover:bg-[#2980b9] transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            Upload & Process
                        </button>
                        <div className={`text-sm font-medium flex-1 ${status.type === 'error' ? 'text-red-500' : status.type === 'success' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {status.message}
                        </div>
                    </section>

                    {/* Chat Section */}
                    <section className="flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
                        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`max-w-[75%] p-3 rounded-xl leading-relaxed ${msg.sender === 'user'
                                        ? 'self-end bg-[#3498db] text-white rounded-br-none'
                                        : 'self-start bg-[#e0e0e0] text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-[#ddd] flex gap-3">
                            <input
                                type="text"
                                value={inputQuestion}
                                onChange={(e) => setInputQuestion(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="e.g., What is the candidate's degree?"
                                disabled={!isReady}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!isReady}
                                className="bg-[#3498db] hover:bg-[#2980b9] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-white p-2 rounded-lg flex items-center justify-center"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
