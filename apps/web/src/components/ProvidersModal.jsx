import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { moviesClient } from "../lib/moviesClient";
import Spinner from "./Spinner";

export default function ProvidersModal({ isOpen, setIsOpen, movie }) {
    const [providers, setProviders] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && movie) {
            setLoading(true);
            moviesClient
                .getProviders(movie.id)
                .then((data) => setProviders(data.results?.GB?.flatrate))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [isOpen, movie]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => setIsOpen(false)}
            >
                {/* ... Modal backdrop and panel ... */}
                <div className="fixed inset-0 bg-black bg-opacity-50" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-white"
                            >
                                Watch {movie.title}
                            </Dialog.Title>
                            <div className="mt-4">
                                {loading && <Spinner />}
                                {providers && providers.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-4">
                                        {providers.map((p) => (
                                            <div
                                                key={p.provider_id}
                                                className="flex flex-col items-center"
                                            >
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                                    alt={p.provider_name}
                                                    className="w-16 h-16 rounded-lg"
                                                />
                                                <span className="text-xs mt-1 text-center">
                                                    {p.provider_name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    !loading && (
                                        <p>
                                            No streaming providers found for
                                            your region (GB).
                                        </p>
                                    )
                                )}
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
