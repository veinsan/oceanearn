export default function Hero() {
  return (
    <div
      className="flex flex-col"
      style={{
        width: 'clamp(627px, 65.3125vw, 1254px)',
        marginTop: 'clamp(100px, 10.47vw, 201px)',
        gap: 'clamp(30px, 3.125vw, 60px)',
      }}
    >

      <h1
        className="font-title font-bold m-0"
        style={{
          fontSize: 'clamp(64px, 6.666vw, 128px)',
          lineHeight: 1,
        }}
      >
        <span className="text-darkBlue-500">Ocean</span>{' '}
        <span className="text-orange-500">Earn</span>
      </h1>

      <p
        className="font-body text-white m-0"
        style={{
          fontSize: 'clamp(18px, 1.666vw, 32px)',
          lineHeight: 'clamp(24px, 2.083vw, 40px)',
          textWrap: 'balance',
          overflowWrap: 'break-word',
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>

      <div className="bg-darkBlue-500 px-[20px] rounded-[20px] text-white text-[20px] font-ui font-bold leading-[40px] w-fit">
        Lihat Selengkapnya
      </div>

    </div>
  );
}