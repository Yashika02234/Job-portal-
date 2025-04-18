export const BackGroundLayout = ({ children }) => {
    return (
      <div className="bg-black relative overflow-x-hidden h-screen">
        <div className="absolute top-[-428px] left-[-186.24px] -rotate-[11.26deg] w-[746.89px] h-[1029.72px] bg-[#102A6C] rounded-full blur-[250px] pointer-events-none">
        </div>
        <div className="absolute top-[-1.43px] left-[800.33px] -rotate-[10.82deg] w-[1142.66px] h-[683.55px] bg-[#A23CE7] rounded-full blur-[271.4px] opacity-[25%] pointer-events-none">
        </div>
        {children}
      </div>
    );
  };
  