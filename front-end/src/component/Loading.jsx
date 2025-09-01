import React from 'react';

const Loading = ({props}) => {
    return (
        <>
              <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{props}</p>
        </div>
      </div> 
        </>
    );
};

export default Loading;