'use client';

interface LoadingSkeletonProps {
    lines?: number;
    className?: string;
    showCard?: boolean;
}

export function LoadingSkeleton({ lines = 3, className = '', showCard = true }: LoadingSkeletonProps) {
    const skeletonContent = (
        <div className={`animate-pulse space-y-4 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <div 
                    key={index} 
                    className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
                        index === 0 ? 'w-3/4' : 
                        index === 1 ? 'w-1/2' : 
                        index === lines - 1 ? 'w-2/3' :
                        'w-full'
                    }`}
                />
            ))}
        </div>
    );

    if (showCard) {
        return (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                {skeletonContent}
            </div>
        );
    }

    return skeletonContent;
}

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="animate-pulse">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-4">
                        {Array.from({ length: columns }).map((_, index) => (
                            <div key={index} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                        ))}
                    </div>
                </div>
                
                {/* Rows */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <div key={rowIndex} className="px-6 py-4">
                            <div className="flex space-x-4">
                                {Array.from({ length: columns }).map((_, colIndex) => (
                                    <div key={colIndex} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface CardGridSkeletonProps {
    cards?: number;
    columns?: number;
}

export function CardGridSkeleton({ cards = 6, columns = 3 }: CardGridSkeletonProps) {
    const gridClass = columns === 2 ? 'grid-cols-2' : 
                      columns === 3 ? 'grid-cols-3' : 
                      columns === 4 ? 'grid-cols-4' : 
                      'grid-cols-3';

    return (
        <div className={`grid ${gridClass} gap-6`}>
            {Array.from({ length: cards }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
}

interface FormSkeletonProps {
    fields?: number;
}

export function FormSkeleton({ fields = 4 }: FormSkeletonProps) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="animate-pulse space-y-6">
                {/* Form Title */}
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                
                {/* Form Fields */}
                {Array.from({ length: fields }).map((_, index) => (
                    <div key={index} className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                ))}
                
                {/* Button */}
                <div className="flex justify-end">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
            </div>
        </div>
    );
}