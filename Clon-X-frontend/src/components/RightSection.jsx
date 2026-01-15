import { BadgeCheck } from "lucide-react";

export default function RightSection() {
  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-3 border border-gray-200 rounded-2xl w-[380px] h-[180] mt-4 pl-4 pr-4 pt-3 pb-3 ">
          <h2 className="text-[20px] font-bold ">Subscribe to Premium</h2>
          <p className="text-[15px] ">
            Suscribe to unblock new features and, if elegible, receive an income payment.
          </p>
          <button
            className="w-[120px] px-4 py-1.5 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-semibold bg-blue-400 text-white dark:text-white hover:bg-blue-500 dark:hover:bg-gray-800 transition-colors mb-2"
            onClick={() => {
              alert("Not functional section");
            }}
          >
            Subscribe
          </button>
        </div>
        <div className="flex flex-col gap-3 border border-gray-200 rounded-2xl w-[380px] h-[180] mt-4 pl-4 pr-4 pt-3 pb-3 ">
          <div>
            <h2 className="text-[20px] font-bold ">Direct on Pulse</h2>
          </div>
          <div className="flex items-center gap-2">
          
            <span className="flex items-center">Visual Live</span>
            <span><BadgeCheck className="fill-blue-400 text-white"/></span>
          </div>
        </div>
      </div>
    </div>
  );
}
