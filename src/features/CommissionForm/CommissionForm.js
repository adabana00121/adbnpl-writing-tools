import React from "react";

const CommissionForm = ({ globalAuthor, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">
      {/* 左側控制欄 */}
      <div className="w-full md:w-[480px] bg-white border-r border-gray-200 flex flex-col h-screen shadow-lg z-30">
        <div className="p-4 border-b border-gray-200 bg-blue-600 text-white flex justify-between items-center">
          <button
            onClick={onBack}
            className="mr-2 hover:bg-white/20 p-1 rounded transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FileText size={20} /> 需求表單
          </h1>
        </div>

        <div className="flex-1 p-8 flex flex-col items-center justify-center text-gray-400 space-y-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <FileText size={48} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-600">功能開發中</h3>
            <p className="text-sm mt-2">
              這裡將提供「委託需求單」產生功能，
              <br />
              協助您整理委託細節。
            </p>
          </div>
        </div>
      </div>

      {/* 右側預覽區 */}
      <div className="flex-1 bg-gray-200 flex items-center justify-center p-8">
        <div className="text-gray-400 font-bold text-2xl opacity-20 uppercase tracking-widest">
          Coming Soon
        </div>
      </div>
    </div>
  );
};

export default CommissionForm;
