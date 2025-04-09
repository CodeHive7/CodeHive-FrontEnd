import { HiTerminal } from 'react-icons/hi';
import { BsGithub, BsTwitter, BsLinkedin } from 'react-icons/bs';

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 text-gray-400">
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <div className="flex items-center mb-4">
                            <HiTerminal className="text-amber-500 w-6 h-6" />
                            <h2 className="ml-2 text-xl font-bold text-white">
                                Code<span className="text-amber-500">Hive</span>
                            </h2>
                        </div>
                        <p className="text-sm mb-4 border-l-2 border-amber-500 pl-3">
                            // The developer-first collaboration platform that empowers software teams
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white">
                                <BsGithub size={20} />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <BsTwitter size={20} />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <BsLinkedin size={20} />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-mono mb-4 text-sm">
                            <span className="text-green-400">class</span> <span className="text-amber-500">Product</span>
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-amber-500">Features</a></li>
                            <li><a href="#" className="hover:text-amber-500">Security</a></li>
                            <li><a href="#" className="hover:text-amber-500">Enterprise</a></li>
                            <li><a href="#" className="hover:text-amber-500">Pricing</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-mono mb-4 text-sm">
                            <span className="text-green-400">class</span> <span className="text-amber-500">Resources</span>
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-amber-500">Documentation</a></li>
                            <li><a href="#" className="hover:text-amber-500">API Reference</a></li>
                            <li><a href="#" className="hover:text-amber-500">Community</a></li>
                            <li><a href="#" className="hover:text-amber-500">Blog</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-mono mb-4 text-sm">
                            <span className="text-green-400">class</span> <span className="text-amber-500">Company</span>
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-amber-500">About</a></li>
                            <li><a href="#" className="hover:text-amber-500">Contact</a></li>
                            <li><a href="#" className="hover:text-amber-500">Careers</a></li>
                            <li><a href="#" className="hover:text-amber-500">Legal</a></li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} CodeHive. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
                        <a href="#" className="hover:text-amber-500">Privacy Policy</a>
                        <a href="#" className="hover:text-amber-500">Terms of Service</a>
                        <a href="#" className="hover:text-amber-500">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}