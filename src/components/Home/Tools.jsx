import { BiTerminal, BiCodeAlt } from 'react-icons/bi';
import { HiTerminal, HiCode } from 'react-icons/hi';

export default function Tools() {
    return (
        <section className="px-4 py-20 bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center">
                    <span className="text-amber-500 font-mono">import</span> <span className="text-white">{ "{" }</span> <span className="text-green-400">DevTools</span> <span className="text-white">{ "}" }</span> <span className="text-amber-500">from</span> <span className="text-blue-400">'codehive'</span>
                </h2>
                <p className="text-gray-400 mb-12 max-w-xl mx-auto text-center border-l-2 border-amber-500 pl-3 text-left font-mono text-sm">
                    // Leverage our extensive toolkit designed specifically for development teams
                </p>

                <div className="flex gap-4 mb-12 justify-center flex-wrap">
                    <span className="px-4 py-2 bg-amber-600 text-white font-mono rounded-md text-sm">
                        IDE Extensions
                    </span>
                    <span className="px-4 py-2 bg-gray-950 border border-gray-700 rounded-md text-sm font-mono">
                        CI/CD Tools
                    </span>
                    <span className="px-4 py-2 bg-gray-950 border border-gray-700 rounded-md text-sm font-mono">
                        Testing Framework
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                            <HiTerminal className="text-amber-500 mr-2" />
                            <span>Intelligent Development Environment</span>
                        </h3>
                        <p className="text-gray-400 mb-6 font-mono text-sm border-l-2 border-gray-700 pl-3">
                            // Enhanced IDE with AI code completion, real-time collaboration, and integrated debugging tools
                        </p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center text-gray-300">
                                <BiCodeAlt className="text-amber-500 mr-2" />
                                <span>Advanced syntax highlighting for 40+ languages</span>
                            </li>
                            <li className="flex items-center text-gray-300">
                                <BiCodeAlt className="text-amber-500 mr-2" />
                                <span>Intelligent code suggestions with ML models</span>
                            </li>
                            <li className="flex items-center text-gray-300">
                                <BiCodeAlt className="text-amber-500 mr-2" />
                                <span>Integrated terminal and debugging console</span>
                            </li>
                        </ul>
                        <button className="text-amber-500 hover:text-amber-400 transition-colors font-mono text-sm flex items-center">
                            <HiCode className="mr-1" /> View Documentation
                        </button>
                    </div>

                    {/* Terminal-like illustration */}
                    <div className="bg-gray-950 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
                        <div className="bg-gray-900 px-4 py-2 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-400 text-sm ml-2 font-mono">terminal</span>
                        </div>
                        <div className="p-4 font-mono text-sm">
                            <p className="text-green-500">user@codehive:~$<span className="text-white ml-1">npm install @codehive/tools</span></p>
                            <p className="text-gray-400">Installing packages...</p>
                            <p className="text-green-400">✓ Dependencies installed successfully</p>
                            <p className="text-green-500">user@codehive:~$<span className="text-white ml-1">codehive init</span></p>
                            <p className="text-blue-400">? Project name: <span className="text-white">awesome-app</span></p>
                            <p className="text-blue-400">? Team size: <span className="text-white">4-10</span></p>
                            <p className="text-blue-400">? Select features: <span className="text-white">CI/CD, Testing, Collaboration</span></p>
                            <p className="text-green-400">✓ Project initialized</p>
                            <p className="text-green-500">user@codehive:~$<span className="text-white ml-1">codehive deploy</span></p>
                            <p className="text-gray-400">Deploying to production...</p>
                            <p className="text-green-400">✓ Deployment complete</p>
                            <p className="text-green-400">✓ App available at: <span className="text-amber-400">https://awesome-app.codehive.dev</span></p>
                            <p className="text-green-500">user@codehive:~$<span className="text-amber-400 animate-pulse">█</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}