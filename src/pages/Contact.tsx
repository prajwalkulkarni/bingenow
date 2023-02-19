import React from 'react';

const Contact: React.FC<Record<string, never>> = () => {
    return (
        <section>
            <div
                className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto mt-24 text-gray-900 bg-gray-100 rounded-lg shadow-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32">
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-4xl font-bold leading-tight lg:text-5xl">Get in touch</h2>
                        <div className="mt-8 text-gray-700">
                            Got something to say? or perhaps something to ask? Fill in the details or send me an <span className="underline">email</span> instead. I&apos;ll get back ASAP.
                        </div>
                    </div>
                    <div className="flex justify-center mt-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24">
                            <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
                        </svg>
                    </div>
                </div>
                <form action="https://submit-form.com/N6nlOfcD">
                    <div className="">
                        <div>
                            <span className="text-sm font-bold text-gray-600 uppercase">Name</span>
                            <input name="name" className="w-full p-3 mt-2 text-gray-900 bg-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
                                type="text" placeholder="" required />
                        </div>
                        <div className="mt-8">
                            <span className="text-sm font-bold text-gray-600 uppercase">Email</span>
                            <input name="mail" className="w-full p-3 mt-2 text-gray-900 bg-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
                                type="text" required />
                        </div>
                        <div className="mt-8">
                            <span className="text-sm font-bold text-gray-600 uppercase">Message</span>
                            <textarea
                                name="message"
                                className="w-full h-32 p-3 mt-2 text-gray-900 bg-gray-300 rounded-lg focus:outline-none focus:shadow-outline"></textarea>
                        </div>
                        <div className="mt-8">
                            <button type="submit"
                                className="w-full p-3 text-sm font-bold tracking-wide text-gray-100 uppercase bg-indigo-500 rounded-lg focus:outline-none focus:shadow-outline">
                                Send Message
                            </button>
                        </div>
                    </div>
                </form>
            </div>

        </section>
    );
};

export default Contact;