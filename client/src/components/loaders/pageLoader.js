import React from 'react'

function PageLoader() {
    return (
        <div className="min-h-[100dvh] bg-gradient-to-b from-blue-50 to-white py-12 px-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    )
}

export default PageLoader