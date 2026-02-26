export default function PostCardSkelton() {
    return (
        <div className="card bg-white max-w-2xl mx-auto p-8 my-4 rounded-lg shadow-md animate-pulse">
            <header className='flex justify-between'>
                <div className="info flex gap-2 items-center">
                    {/* Profile image skeleton */}
                    <div className='size-12 rounded-full bg-gray-300'></div>
                    <div className="details">
                        {/* Name skeleton */}
                        <div className='h-4 w-28 bg-gray-300 rounded mb-2'></div>
                        {/* Time skeleton */}
                        <div className='h-3 w-20 bg-gray-200 rounded'></div>
                    </div>
                </div>
                {/* Menu button skeleton */}
                <div className='h-6 w-4 bg-gray-200 rounded'></div>
            </header>
            <div className="post-body">
                <figure>
                    <figcaption>
                        {/* Text content skeleton */}
                        <div className='my-4 space-y-2'>
                            <div className='h-4 w-full bg-gray-200 rounded'></div>
                            <div className='h-4 w-3/4 bg-gray-200 rounded'></div>
                        </div>
                    </figcaption>
                    {/* Image skeleton */}
                    <div className='-mx-8'>
                        <div className='w-full h-140 bg-gray-300'></div>
                    </div>
                </figure>
                <div className="likes-and-comment flex justify-between py-2">
                    <div className="icons flex items-center gap-2">
                        {/* Like icons skeleton */}
                        <div className='h-5 w-5 bg-gray-200 rounded-full'></div>
                        <div className='h-5 w-5 bg-gray-200 rounded-full'></div>
                        <div className='h-3 w-16 bg-gray-200 rounded'></div>
                    </div>
                    {/* Comments count skeleton */}
                    <div className='h-3 w-24 bg-gray-200 rounded'></div>
                </div>
                <div className="reacts flex justify-around pt-2 border-y border-gray-300/50 -mx-8 py-2">
                    {/* React buttons skeleton */}
                    <div className='h-6 w-12 bg-gray-200 rounded'></div>
                    <div className='h-6 w-12 bg-gray-200 rounded'></div>
                    <div className='h-6 w-12 bg-gray-200 rounded'></div>
                </div>
                <div className="all-comment mt-4 space-y-4">
                    {/* Comment skeletons */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-2 items-start">
                            <div className='size-8 rounded-full bg-gray-300'></div>
                            <div className="flex-1">
                                <div className='h-3 w-24 bg-gray-300 rounded mb-2'></div>
                                <div className='h-3 w-full bg-gray-200 rounded'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
