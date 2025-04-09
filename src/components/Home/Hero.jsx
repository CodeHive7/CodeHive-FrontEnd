import { HiTerminal } from 'react-icons/hi';
import { BiCodeAlt } from 'react-icons/bi';

export default function Hero() {
    return (
        <section className="relative px-4 pt-20 pb-32 overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gray-800/30 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Terminal Logo */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 inline-flex items-center">
                        <HiTerminal className="text-amber-500 w-12 h-12" />
                        <h2 className="ml-3 text-2xl font-bold text-white">
                            Code<span className="text-amber-500">Hive</span>
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="font-mono text-green-400">build</span>
                            <span className="text-amber-500">(</span>
                            <span className="font-mono text-blue-400">collaboration</span>
                            <span className="text-amber-500">)</span>
                        </h1>
                        
                        <p className="mb-2 text-2xl font-bold">The Developer-First Collaboration Platform</p>
                        
                        <p className="text-gray-400 mb-8 border-l-2 border-amber-500 pl-3 font-mono text-sm">
                            // Build, collaborate, and execute projects with a platform designed by developers, for developers.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-4 justify-center lg:justify-start">
                            <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md text-base font-medium flex items-center">
                                <BiCodeAlt className="mr-2" size={20} />
                                Get Started Free
                            </button>
                            <button className="border border-gray-700 bg-gray-900 hover:bg-gray-800 px-6 py-3 rounded-md text-base font-medium flex items-center">
                                <span className="font-mono text-amber-500 mr-2">{"<>"}</span>
                                Read Docs
                            </button>
                        </div>
                    </div>

                    {/* Code Editor Hero Image */}
                    <div className="lg:w-1/2 rounded-lg border border-gray-700 bg-gray-900 shadow-xl overflow-hidden">
                        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-400 text-sm ml-2 font-mono">project.js</span>
                        </div>
                        <div className="p-6 font-mono text-sm">
                            <p><span className="text-blue-400">import</span> <span className="text-amber-400">{ "{" } CodeHive {"}" }</span> <span className="text-blue-400">from</span> <span className="text-green-400">'code-hive'</span>;</p>
                            <br />
                            <p><span className="text-green-400">// Initialize your project</span></p>
                            <p><span className="text-blue-400">const</span> <span className="text-amber-400">project</span> = <span className="text-blue-400">new</span> <span className="text-purple-400">CodeHive</span>{"()"};</p>
                            <br />
                            <p><span className="text-purple-400">project</span>.<span className="text-blue-400">createTeam</span>{"("}<span className="text-green-400">'Dream Team'</span>{")"};</p>
                            <p><span className="text-purple-400">project</span>.<span className="text-blue-400">addCollaborators</span>{"(["}<span className="text-green-400">'dev1'</span>, <span className="text-green-400">'dev2'</span>{"])"};</p>
                            <p><span className="text-purple-400">project</span>.<span className="text-blue-400">setupWorkflow</span>{"()"};</p>
                            <br />
                            <p><span className="text-blue-400">async function</span> <span className="text-yellow-400">startCoding</span>{"()"} {"{"}</p>
                            <p className="ml-6"><span className="text-blue-400">await</span> <span className="text-purple-400">project</span>.<span className="text-blue-400">deploy</span>{"()"};</p>
                            <p className="ml-6"><span className="text-green-400">// Magic happens here</span></p>
                            <p>{"}"}</p>
                            <br />
                            <p><span className="text-yellow-400">startCoding</span>{"()"};<span className="animate-pulse">|</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}