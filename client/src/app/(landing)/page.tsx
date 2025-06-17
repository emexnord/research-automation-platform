import MaxWidthWrapper from '@/components/max-width-wrapper';

export default function Home() {
    return (
        <MaxWidthWrapper>
            <div className="bg-gray-50">
    
    <section className="py-12 sm:py-16 lg:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-16">
                <div>
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl font-pj">
                            Automate Your Research. Accelerate Your Discoveries.
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 sm:mt-8 font-inter">
                            Researchify empowers you to streamline your research workflows, manage data, and collaborate seamlessly.
                            Focus on innovation, we'll handle the automation.
                        </p>

                        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <a href="/signup" title="" className="px-6 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-lg focus:outline-none focus:bg-gray-600 font-pj hover:bg-gray-600" role="button">
                                Start Your Free Trial
                            </a>
                            <a href="#learn-more" title="" className="px-6 py-3 text-lg font-bold text-gray-900 transition-all duration-200 bg-transparent border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-100 font-pj" role="button">
                                Learn More
                            </a>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-center space-x-6 lg:justify-start sm:space-x-8">
                        <div className="flex items-center">
                            <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">500+</p>
                            <p className="ml-3 text-sm text-gray-900 font-pj">Students<br />Used</p>
                        </div>

                        <div className="hidden sm:block">
                            <svg className="text-gray-400" width="16" height="39" viewBox="0 0 16 39" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <line x1="0.72265" y1="10.584" x2="15.7226" y2="0.583975"></line>
                                <line x1="0.72265" y1="17.584" x2="15.7226" y2="7.58398"></line>
                                <line x1="0.72265" y1="24.584" x2="15.7226" y2="14.584"></line>
                                <line x1="0.72265" y1="31.584" x2="15.7226" y2="21.584"></line>
                                <line x1="0.72265" y1="38.584" x2="15.7226" y2="28.584"></line>
                            </svg>
                        </div>

                        <div className="flex items-center">
                            <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">1000+</p>
                            <p className="ml-3 text-sm text-gray-900 font-pj">Research Projects<br />Completed</p>
                        </div>
                    </div>
                </div>

                <div>
                    <img className="w-full h-auto rounded-lg shadow-xl" src="/hero.jpg" alt="Researchify Automation Platform" />
                </div>
            </div>
        </div>
    </section>
</div>

        </MaxWidthWrapper>
    );
}
