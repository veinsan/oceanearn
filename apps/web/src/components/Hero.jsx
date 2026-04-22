export default function Hero() {
  return (
    <section className="flex-1 flex items-center">
      
      <div className="w-full">
        
        <div className="max-w-[1254px] flex flex-col gap-[clamp(32px,3vw,60px)] py-[clamp(80px,10vh,297px)]">
          
          {/* TITLE */}
          <h1 className="font-title font-bold leading-none">
            <span className="text-darkBlue-500 text-[clamp(3rem,6vw,96px)]">
              Ocean
            </span>{' '}
            <span className="text-orange-500 text-[clamp(3rem,6vw,96px)]">
              Earn
            </span>
          </h1>

          {/* TEXT */}
          <p className="font-body text-white leading-relaxed max-w-[1254px] text-[clamp(1rem,1.5vw,24px)]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>

          {/* BUTTON */}
          <button className="w-[190px] h-[40px] bg-darkBlue-500 text-white font-ui font-bold rounded-xl2 hover:bg-darkBlue-600">
            Lihat Selengkapnya
          </button>

        </div>

      </div>
    </section>
  );
}